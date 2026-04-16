# API 集成分析 - Cloudflare Pages Functions

## 现有架构分析

### 1. 自定义 API 客户端 (`src/api/`)

**特点**：
- 使用原生 fetch API 实现
- 直接调用 Cloudflare Pages Functions 端点
- 手动处理请求/响应
- 支持的功能：
  - `users.js` - 用户管理（创建/登录、获取用户、更新时间）
  - `books.js` - 书籍管理（CRUD、角色关联）
  - `characters.js` - 角色管理
  - `chapters.js` - 章节管理
  - `story.js` - 故事生成
  - `puzzle.js` - 拼题
  - `share.js` - 分享

**优点**：
- ✅ 完全控制请求逻辑
- ✅ 轻量级，无额外依赖
- ✅ 已实现完整的功能

**缺点**：
- ❌ 需要手动维护类型定义
- ❌ 没有自动类型生成
- ❌ 没有缓存/重试等高级功能

### 2. HeyAPI 自动生成客户端 (`src/lib/hey-api/`)

**特点**：
- 基于 OpenAPI schema 自动生成
- 使用 TanStack Query 进行数据获取
- 自动类型推断
- 支持拦截器（如添加认证 Cookie）

**当前配置**：
```typescript
const openapiUrl: string =
  process.env.EXPO_PUBLIC_OPENAPI_URL ??
  `${process.env.EXPO_PUBLIC_BASE_URL}/api/openapi/app/schema`;
```

**优点**：
- ✅ 自动类型生成
- ✅ TanStack Query 集成（缓存、重试、乐观更新）
- ✅ 开发体验好

**缺点**：
- ❌ 需要后端提供 OpenAPI schema
- ❌ 依赖 HeyAPI 工具链
- ❌ 当前配置与 Cloudflare Pages Functions 不匹配

### 3. 应用路由 (`src/app/`)

**特点**：
- 使用 Expo Router
- 分为 logged 和 public 路由
- 集成认证系统

## 整合方案

### 方案 A：完全迁移到 HeyAPI（推荐）

**步骤**：

1. **在 Cloudflare Pages Functions 中提供 OpenAPI schema**
   ```javascript
   // functions/api/openapi/app/schema.js
   export async function onRequest(context) {
     const openapiSpec = {
       openapi: '3.0.0',
       info: {
         title: 'Game API',
         version: '1.0.0',
       },
       paths: {
         '/users': {
           post: {
             summary: 'Create or login user',
             requestBody: {
               content: {
                 'application/json': {
                   schema: {
                     type: 'object',
                     properties: {
                       username: { type: 'string' },
                       email: { type: 'string' }
                     }
                   }
                 }
               }
             }
           }
         }
         // ... 其他端点
       }
     };
     
     return new Response(JSON.stringify(openapiSpec), {
       headers: { 'Content-Type': 'application/json' }
     });
   }
   ```

2. **更新 HeyAPI 配置**
   ```typescript
   // src/lib/hey-api/config.ts
   const openapiUrl: string =
     process.env.EXPO_PUBLIC_OPENAPI_URL ??
     'https://lego-story.pages.dev/api/openapi/app/schema';
   ```

3. **设置环境变量**
   ```bash
   EXPO_PUBLIC_BASE_URL=https://lego-story.pages.dev
   ```

4. **生成 API 客户端**
   ```bash
   pnpm gen:api
   ```

5. **逐步替换自定义 API 调用**
   ```typescript
   // 之前
   import { usersAPI } from '@/api/users';
   const user = await usersAPI.getUser(userId);
   
   // 之后
   import { api } from '@/lib/hey-api/api';
   const { data } = await useQuery(api.userGetByIdOptions({ path: { id: userId } }));
   ```

**优点**：
- ✅ 类型安全
- ✅ 自动缓存
- ✅ 更好的开发体验
- ✅ 与认证系统集成

**缺点**：
- ❌ 需要维护 OpenAPI schema
- ❌ 迁移工作量大

### 方案 B：混合使用（渐进式迁移）

**策略**：

1. **保留自定义 API 客户端用于复杂逻辑**
   - Story 生成（复杂参数）
   - Puzzle（特殊逻辑）

2. **使用 HeyAPI 用于标准 CRUD**
   - Users
   - Books
   - Characters
   - Chapters

3. **统一 API 基础 URL**
   ```typescript
   // src/api/client.js
   const API_BASE = Constants.expoConfig?.extra?.apiBaseUrl || 
                   Constants.expoConfig?.extra?.EXPO_PUBLIC_BASE_URL + '/api' ||
                   'https://lego-story.pages.dev/api';
   ```

**实现**：
```typescript
// src/api/index.js
export { apiClient } from './client';
export { usersAPI } from './users'; // 保留自定义
export { booksAPI } from './books';   // 保留自定义
// ... 其他保留

// src/lib/hey-api/api.ts
export * as api from './generated/@tanstack/react-query.gen';
// 用于 HeyAPI 生成的端点
```

**优点**：
- ✅ 渐进式迁移
- ✅ 灵活性高
- ✅ 可以逐步验证

**缺点**：
- ❌ 两套 API 系统并存
- ❌ 维护成本增加

### 方案 C：增强自定义 API 客户端

**改进**：

1. **添加 TypeScript 类型**
   ```typescript
   // src/api/types.ts
   export interface User {
     id: string;
     username: string;
     email?: string;
     timeUsed?: number;
     dailyTimeLimit?: number;
   }
   
   export interface Book {
     id: string;
     userId: string;
     title: string;
     createdAt: string;
   }
   ```

2. **添加 TanStack Query 包装器**
   ```typescript
   // src/api/hooks.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { usersAPI } from './users';
   
   export function useUser(userId) {
     return useQuery({
       queryKey: ['user', userId],
       queryFn: () => usersAPI.getUser(userId),
     });
   }
   
   export function useUpdateUser() {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: usersAPI.updateTimeUsage,
       onSuccess: () => {
         queryClient.invalidateQueries(['user']);
       },
     });
   }
   ```

3. **统一认证处理**
   ```typescript
   // src/api/client.js
   import Constants from 'expo-constants';
   import { authClient } from '@/features/auth/client';

   class APIClient {
     constructor() {
       this.baseURL = Constants.expoConfig?.extra?.apiBaseUrl || 
                       'https://lego-story.pages.dev/api';
     }
     
     async request(endpoint, options = {}) {
       const url = `${this.baseURL}${endpoint}`;
       
       const defaultHeaders = {
         'Content-Type': 'application/json',
         'Cookie': authClient.getCookie(),
       };
       
       // ... 其余逻辑
     }
   }
   ```

**优点**：
- ✅ 保持现有功能
- ✅ 添加类型安全
- ✅ 添加缓存和状态管理
- ✅ 迁移成本低

**缺点**：
- ❌ 仍需手动维护类型
- ❌ 没有自动 schema 驱动

## 推荐方案

### 阶段 1：增强自定义 API（短期）

1. 添加 TypeScript 类型定义
2. 集成 TanStack Query hooks
3. 统一认证处理
4. 改进错误处理

### 阶段 2：添加 OpenAPI 支持（中期）

1. 在 Cloudflare Pages Functions 中实现 OpenAPI schema 端点
2. 配置 HeyAPI 生成客户端
3. 逐步将简单 CRUD 迁移到 HeyAPI
4. 保留复杂逻辑在自定义 API

### 阶段 3：完全迁移（长期）

1. 所有端点提供 OpenAPI schema
2. 完全迁移到 HeyAPI
3. 删除自定义 API 客户端
4. 简化架构

## Cloudflare Pages Functions 结构建议

```
functions/
├── api/
│   ├── users.js              # 用户管理
│   ├── books.js              # 书籍管理
│   ├── characters.js         # 角色管理
│   ├── chapters.js           # 章节管理
│   ├── story.js              # 故事生成
│   ├── puzzle.js             # 拼题
│   ├── share.js              # 分享
│   └── openapi/
│       └── app/
│           └── schema.js      # OpenAPI schema
└── auth/
    └── login.js             # 认证
```

## 下一步行动

1. **选择整合方案**：推荐方案 C（增强自定义 API）+ 方案 B（渐进式迁移）
2. **添加 TypeScript 类型**：为现有 API 添加类型定义
3. **集成 TanStack Query**：为 API 调用添加 hooks
4. **实现 OpenAPI schema**：在 Cloudflare Pages Functions 中添加 schema 端点
5. **配置 HeyAPI**：设置自动生成
6. **逐步迁移**：从简单端点开始迁移
