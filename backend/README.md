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

当前使用模拟数据。需要配置 Cloudflare KV 或 D1 数据库：

### Cloudflare KV

```javascript
// 在 wrangler.toml 中配置
[[kv_namespaces]]
binding = "USERS_KV"
id = "your-kv-namespace-id"
```

### Cloudflare D1

```javascript
// 在 wrangler.toml 中配置
[[d1_databases]]
binding = "DB"
database_name = "game-db"
database_id = "your-database-id"
```

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
