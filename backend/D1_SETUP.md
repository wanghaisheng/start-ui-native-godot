# Cloudflare D1 数据库设置指南

本文档说明如何设置和使用 Cloudflare D1 数据库。

## 步骤 1：创建 D1 数据库

```bash
cd backend
npx wrangler d1 create game-db
```

输出示例：
```
✨ Successfully created DB 'game-db'

[[d1_databases]]
binding = "DB"
database_name = "game-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

复制 `database_id` 到 `wrangler.toml`。

## 步骤 2：配置 wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "game-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## 步骤 3：运行数据库迁移

### 本地开发

```bash
# 应用迁移到本地 D1
npx wrangler d1 migrations apply game-db --local

# 查看本地数据库
npx wrangler d1 execute game-db --local --command "SELECT * FROM users"
```

### 生产环境

```bash
# 应用迁移到生产 D1
npx wrangler d1 migrations apply game-db

# 查看生产数据库
npx wrangler d1 execute game-db --command "SELECT * FROM users"
```

## 步骤 4：在 Functions 中使用 D1

### 基本用法

```javascript
export async function onRequest(context) {
  const { env } = context;
  const db = env.DB; // 从 wrangler.toml 的 binding 获取
  
  // 查询
  const result = await db.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userId)
    .first();
  
  return new Response(JSON.stringify(result));
}
```

### 插入数据

```javascript
export async function onRequest(context) {
  const { env, request } = context;
  const db = env.DB;
  const body = await request.json();
  
  const result = await db.prepare(
    'INSERT INTO users (id, username, email) VALUES (?, ?, ?)'
  )
    .bind(crypto.randomUUID(), body.username, body.email)
    .run();
  
  return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }));
}
```

### 更新数据

```javascript
export async function onRequest(context) {
  const { env, request } = context;
  const db = env.DB;
  const body = await request.json();
  
  const result = await db.prepare(
    'UPDATE users SET time_used = ? WHERE id = ?'
  )
    .bind(body.timeUsed, body.userId)
    .run();
  
  return new Response(JSON.stringify({ success: true }));
}
```

### 批量查询

```javascript
export async function onRequest(context) {
  const { env } = context;
  const db = env.DB;
  
  const { results } = await db.prepare('SELECT * FROM books WHERE user_id = ?')
    .bind(userId)
    .all();
  
  return new Response(JSON.stringify(results));
}
```

## 步骤 5：更新 API 端点

### 更新 users.js

```javascript
export async function onRequest(context) {
  const { env, request } = context;
  const db = env.DB;
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    const userId = url.searchParams.get('userId');
    
    const user = await db.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (method === 'POST') {
    const body = await request.json();
    const { username, email } = body;
    
    const userId = crypto.randomUUID();
    
    await db.prepare(
      'INSERT INTO users (id, username, email) VALUES (?, ?, ?)'
    )
      .bind(userId, username, email || null)
      .run();
    
    const user = await db.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();
    
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ... 其他方法
}
```

## 步骤 6：本地开发测试

```bash
# 启动本地开发服务器（带 D1）
npx wrangler pages dev --d1 DB=local

# 或者使用 wrangler.toml 配置
npx wrangler pages dev --local
```

## 常用 D1 命令

```bash
# 创建数据库
npx wrangler d1 create game-db

# 列出所有数据库
npx wrangler d1 list

# 执行 SQL 查询
npx wrangler d1 execute game-db --command "SELECT * FROM users"

# 导出数据库
npx wrangler d1 export game-db --output=backup.sql

# 导入数据库
npx wrangler d1 execute game-db --file=backup.sql
```

## 数据库表结构

### users
- id (TEXT, PRIMARY KEY)
- username (TEXT, UNIQUE)
- email (TEXT)
- time_used (INTEGER)
- daily_time_limit (INTEGER)
- created_at (TEXT)
- updated_at (TEXT)

### books
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- title (TEXT)
- created_at (TEXT)
- updated_at (TEXT)

### characters
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- personality (TEXT)
- speaking_style (TEXT)
- creator_id (TEXT, FOREIGN KEY)
- created_at (TEXT)

### book_characters
- id (TEXT, PRIMARY KEY)
- book_id (TEXT, FOREIGN KEY)
- character_id (TEXT, FOREIGN KEY)
- custom_name (TEXT)
- role_type (TEXT)
- created_at (TEXT)

### chapters
- id (TEXT, PRIMARY KEY)
- book_id (TEXT, FOREIGN KEY)
- chapter_number (INTEGER)
- title (TEXT)
- content (TEXT)
- summary (TEXT)
- puzzle (TEXT)
- created_at (TEXT)

## 注意事项

1. **D1 是 SQLite**：支持标准 SQL 语法，但有一些限制
2. **大小限制**：每个数据库最大 5GB
3. **并发限制**：每秒 1000 次写入
4. **本地开发**：使用 `--local` 标志进行本地测试
5. **迁移**：使用 `wrangler d1 migrations apply` 应用迁移
6. **备份**：定期使用 `wrangler d1 export` 备份数据

## 故障排查

### 问题：数据库未绑定

**错误**：`DB is not defined`

**解决**：检查 `wrangler.toml` 中的 `binding` 名称与代码中使用的一致。

### 问题：迁移失败

**错误**：`Migration failed`

**解决**：
```bash
# 检查迁移文件
npx wrangler d1 migrations list game-db

# 回滚迁移
npx wrangler d1 migrations rollback game-db
```

### 问题：本地数据库丢失

**解决**：本地 D1 数据存储在内存中，重启后丢失。使用 `--local` 标志时会创建持久化本地数据库文件。
