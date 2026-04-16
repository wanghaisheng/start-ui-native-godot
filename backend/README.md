# Game API Backend

Cloudflare Pages Functions 后端，为 React Native + Godot Starter 应用提供 API 服务。

## 功能

- ✅ 用户管理（创建、登录、更新）
- ✅ 书籍管理（CRUD）
- ✅ 角色管理（CRUD）
- ✅ 故事生成
- ✅ OpenAPI Schema 自动生成

## 本地开发

```bash
cd backend
npm install
npx wrangler pages dev
```

访问 `http://localhost:8788/api/openapi/schema` 查看 OpenAPI schema。

## 部署

```bash
npx wrangler pages deploy
```

## API 端点

- `GET /api/users` - 获取用户
- `POST /api/users` - 创建或登录用户
- `PUT /api/users` - 更新用户
- `GET /api/books` - 获取书籍列表
- `POST /api/books` - 创建书籍
- `PUT /api/books` - 更新书籍
- `DELETE /api/books` - 删除书籍
- `GET /api/characters` - 获取角色列表
- `POST /api/characters` - 创建角色
- `PUT /api/characters` - 更新角色
- `DELETE /api/characters` - 删除角色
- `POST /api/story` - 生成故事
- `GET /api/openapi/schema` - OpenAPI Schema

## 数据库

项目使用 Cloudflare D1 数据库。详细配置请查看 [D1_SETUP.md](./D1_SETUP.md)。

### 快速设置

1. 创建 D1 数据库：
   ```bash
   npx wrangler d1 create game-db
   ```

2. 复制 `database_id` 到 `wrangler.toml`

3. 应用数据库迁移：
   ```bash
   npx wrangler d1 migrations apply game-db --local
   ```

### 数据库表结构

- `users` - 用户表
- `books` - 书籍表
- `characters` - 角色表
- `book_characters` - 书籍角色关联表
- `chapters` - 章节表

## 与 React Native 集成

React Native 应用使用 HeyAPI 从 OpenAPI schema 自动生成类型安全的 API 客户端：

```bash
# 在 React Native 项目中
pnpm gen:api
```

## 注意事项

- 所有 API 端点当前返回模拟数据
- 需要实现实际的数据库操作
- 需要添加认证中间件
- 需要添加错误处理和日志记录
