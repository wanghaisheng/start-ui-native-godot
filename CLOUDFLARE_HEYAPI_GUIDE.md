# Cloudflare Pages Functions + HeyAPI 集成指南

## 概述

本文档说明如何在 Cloudflare Pages Functions 中提供 OpenAPI schema，以便使用 HeyAPI 自动生成类型安全的 API 客户端。

## 架构

```
React Native App
    ↓ (HeyAPI 生成)
src/lib/hey-api/generated/
    ↓ (TanStack Query)
应用组件
    ↓ (HTTP 请求)
Cloudflare Pages Functions
    ↓
数据库/其他服务
```

## 步骤 1：在 Cloudflare Pages Functions 中创建 OpenAPI Schema 端点

### 1.1 创建 OpenAPI schema 文件

在 Cloudflare Pages Functions 项目中创建 OpenAPI schema 定义：

```javascript
// functions/_openapi-schema.js
export const onRequest = async (context) => {
  const openapiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Game API',
      version: '1.0.0',
      description: 'Game application API',
    },
    servers: [
      {
        url: 'https://lego-story.pages.dev',
        description: 'Production server',
      },
    ],
    paths: {
      '/api/users': {
        get: {
          summary: 'Get user',
          operationId: 'getUser',
          parameters: [
            {
              name: 'userId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'User data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                      email: { type: 'string' },
                      timeUsed: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create or login user',
          operationId: 'createOrLoginUser',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                  },
                  required: ['username'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'User created or logged in',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          summary: 'Update user',
          operationId: 'updateUser',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    timeUsed: { type: 'number' },
                    dailyTimeLimit: { type: 'number' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'User updated',
            },
          },
        },
      },
      '/api/books': {
        get: {
          summary: 'Get books',
          operationId: 'getBooks',
          parameters: [
            {
              name: 'userId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'List of books',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        userId: { type: 'string' },
                        title: { type: 'string' },
                        createdAt: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create book',
          operationId: 'createBook',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    title: { type: 'string' },
                  },
                  required: ['userId', 'title'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Book created',
            },
          },
        },
      },
      // ... 其他端点
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', nullable: true },
            timeUsed: { type: 'number', nullable: true },
            dailyTimeLimit: { type: 'number', nullable: true },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(openapiSpec, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
```

### 1.2 或者使用动态生成（推荐）

如果你的 API 端点已经实现，可以使用工具自动生成 OpenAPI schema：

```javascript
// functions/api/openapi/schema.js
import { onRequest } from '@cloudflare/next-on-pages';

// 导入你的 API 路由配置
import { userRoutes } from '../users';
import { bookRoutes } from '../books';
// ...

export const onRequest = async (context) => {
  // 动态生成 OpenAPI schema
  const openapiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Game API',
      version: '1.0.0',
    },
    paths: {
      ...generatePathsFromRoutes([userRoutes, bookRoutes]),
    },
  };

  return new Response(JSON.stringify(openapiSpec, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## 步骤 2：配置 HeyAPI

### 2.1 更新 HeyAPI 配置

```typescript
// src/lib/hey-api/config.ts
import { defineConfig } from '@hey-api/openapi-ts';

const openapiUrl: string =
  process.env.EXPO_PUBLIC_OPENAPI_URL ??
  'https://lego-story.pages.dev/api/openapi/schema';

export default defineConfig({
  input: {
    path: openapiUrl,
  },
  output: {
    path: 'src/lib/hey-api/generated',
  },
  plugins: [
    {
      name: '@tanstack/react-query',
    },
    {
      name: '@hey-api/typescript',
    },
  ],
});
```

### 2.2 设置环境变量

在 `.env` 文件中添加：

```bash
EXPO_PUBLIC_BASE_URL=https://lego-story.pages.dev
EXPO_PUBLIC_OPENAPI_URL=https://lego-story.pages.dev/api/openapi/schema
```

或者在 `app.config.ts` 中配置：

```typescript
extra: {
  apiBaseUrl: 'https://lego-story.pages.dev/api',
  EXPO_PUBLIC_OPENAPI_URL: 'https://lego-story.pages.dev/api/openapi/schema',
}
```

## 步骤 3：生成 API 客户端

```bash
pnpm gen:api
```

这将会：
1. 从 OpenAPI schema 读取 API 定义
2. 生成 TypeScript 类型
3. 生成 TanStack Query hooks
4. 生成 axios/fetch 客户端

## 步骤 4：使用生成的客户端

### 4.1 基本用法

```typescript
import { api } from '@/lib/hey-api/api';

// 使用 TanStack Query hook
function UserList({ userId }) {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.user.list({ query: { userId } }),
  });

  if (isLoading) return <Text>Loading...</Text>;
  
  return (
    <View>
      {users?.map(user => (
        <Text key={user.id}>{user.username}</Text>
      ))}
    </View>
  );
}
```

### 4.2 集成认证

```typescript
// src/lib/hey-api/api.ts
import { client } from '@/lib/hey-api/generated/client.gen';
import { authClient } from '@/features/auth/client';

client.interceptors.request.use((request) => {
  // 添加认证 Cookie
  request.headers.append('Cookie', authClient.getCookie());
  return request;
});
```

### 4.3 使用自动生成的 hooks

```typescript
// HeyAPI 生成的 hooks 示例
import { 
  useUserGetById, 
  useUserUpdate, 
  useBookGetList,
  useBookCreate 
} from '@/lib/hey-api/api';

function UserProfile({ userId }) {
  // 获取用户
  const { data: user, isLoading } = useUserGetById({
    path: { id: userId },
  });

  // 更新用户
  const updateUser = useUserUpdate();

  return (
    <View>
      <Text>{user?.username}</Text>
      <Button 
        onPress={() => updateUser.mutate({ path: { id: userId }, body: { timeUsed: 30 } })}
      >
        Update Time
      </Button>
    </View>
  );
}
```

## 步骤 5：Cloudflare Pages Functions 结构

推荐的项目结构：

```
cloudflare-pages-project/
├── functions/
│   ├── api/
│   │   ├── users.js           # 用户 API
│   │   ├── books.js           # 书籍 API
│   │   ├── characters.js      # 角色管理
│   │   ├── chapters.js        # 章节管理
│   │   ├── story.js           # 故事生成
│   │   ├── puzzle.js          # 拼题
│   │   ├── share.js           # 分享
│   │   └── openapi/
│   │       └── schema.js     # OpenAPI schema 端点
│   └── auth/
│       └── login.js          # 认证
├── wrangler.toml              # Cloudflare 配置
└── package.json
```

## 步骤 6：部署 OpenAPI Schema 端点

确保 OpenAPI schema 端点可访问：

```bash
# 测试 OpenAPI schema 端点
curl https://lego-story.pages.dev/api/openapi/schema
```

应该返回类似这样的 JSON：

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Game API",
    "version": "1.0.0"
  },
  "paths": {
    "/api/users": {
      "get": { ... },
      "post": { ... }
    }
  }
}
```

## 优势

### 使用 HeyAPI 的好处

1. **类型安全**
   - 自动生成 TypeScript 类型
   - 编译时类型检查
   - IDE 自动补全

2. **TanStack Query 集成**
   - 自动缓存
   - 自动重试
   - 乐观更新
   - 后台刷新

3. **开发体验**
   - 自动生成 hooks
   - 减少样板代码
   - 统一的错误处理

4. **维护性**
   - Schema 驱动
   - 单一真实来源
   - 自动同步 API 变更

## 迁移策略

### 渐进式迁移

1. **保留现有自定义 API**（src/api）
2. **添加 OpenAPI schema 端点**（Cloudflare Functions）
3. **配置 HeyAPI**（src/lib/hey-api）
4. **生成新客户端**
5. **逐步替换**（从简单端点开始）

### 替换示例

```typescript
// 之前：自定义 API
import { usersAPI } from '@/api/users';
const user = await usersAPI.getUser(userId);

// 之后：HeyAPI
import { useUserGetById } from '@/lib/hey-api/api';
const { data: user } = useUserGetById({
  path: { id: userId },
});
```

## 故障排查

### 问题 1：无法访问 OpenAPI schema

**检查**：
- 确认 Cloudflare Pages Functions 已部署
- 确认 OpenAPI schema 端点路径正确
- 检查 CORS 配置

**解决**：
```javascript
// 在 OpenAPI schema 端点添加 CORS
return new Response(JSON.stringify(openapiSpec), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
```

### 问题 2：生成的类型不正确

**检查**：
- 确认 OpenAPI schema 格式正确
- 确认 HeyAPI 版本兼容
- 检查 `gen:api` 脚本输出

**解决**：
```bash
# 清除生成的文件重新生成
rm -rf src/lib/hey-api/generated
pnpm gen:api
```

### 问题 3：认证 Cookie 未传递

**检查**：
- 确认 authClient 正确返回 Cookie
- 检查拦截器配置

**解决**：
```typescript
// src/lib/hey-api/api.ts
client.interceptors.request.use((request) => {
  const cookie = authClient.getCookie();
  if (cookie) {
    request.headers.append('Cookie', cookie);
  }
  return request;
});
```

## 总结

使用 Cloudflare Pages Functions + HeyAPI 的关键步骤：

1. ✅ 在 Cloudflare Pages Functions 中创建 OpenAPI schema 端点
2. ✅ 配置 HeyAPI 指向 schema URL
3. ✅ 运行 `pnpm gen:api` 生成客户端
4. ✅ 使用生成的 TanStack Query hooks
5. ✅ 集成认证拦截器

这样你就可以在 Cloudflare Pages Functions 上获得类型安全、自动缓存的 API 客户端！
