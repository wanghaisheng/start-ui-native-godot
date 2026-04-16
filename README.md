<h1 align="center"><img src=".github/assets/thumbnail.svg" alt="OpenAgenticGame Team - React Native + Godot Starter" /></h1>

🎮 **Game Starter** - OpenAgenticGame Team - 基于 🚀 Start UI <small>[native]</small> 的游戏开发模板

## 🌐 Language / 语言

- 🇬🇧 [English](./README-EN.md)
- 🇨🇳 [中文](./README-ZH.md)

---

This project is a new game development template built on [BearStudio Team](https://www.bearstudio.fr/team)'s Start UI Native, integrated with the [Godot Engine](https://godotengine.org/).

本项目是在 [BearStudio Team](https://www.bearstudio.fr/team) 的 Start UI Native 基础上集成了 [Godot 引擎](https://godotengine.org/)，打造了一个全新的游戏开发模板。

## 📦 项目结构

```
项目根目录/
├── src/                      # React Native 应用代码
│   ├── app/                 # Expo Router 页面
│   ├── lib/                 # 工具库
│   │   └── hey-api/         # HeyAPI 自动生成的 API 客户端
│   └── features/            # 功能模块
├── backend/                  # Cloudflare Pages Functions 后端
│   ├── functions/           # API 端点
│   │   ├── api/
│   │   │   ├── users.js
│   │   │   ├── books.js
│   │   │   ├── characters.js
│   │   │   ├── story.js
│   │   │   └── openapi/
│   │   │       └── schema.js  # OpenAPI Schema
│   ├── migrations/          # D1 数据库迁移
│   ├── wrangler.toml        # Cloudflare 配置
│   └── D1_SETUP.md          # D1 数据库设置指南
├── plugin/                   # 自定义 Expo 插件
├── assets/                   # Godot 资源文件
└── ref/                      # 参考文档
```

## 🗄️ 后端服务

项目包含完整的 Cloudflare Pages Functions 后端，提供：

- ✅ **API 端点**: 用户、书籍、角色、故事生成
- ✅ **OpenAPI Schema**: 自动生成类型安全的 API 客户端
- ✅ **D1 数据库**: Cloudflare SQLite 数据库
- ✅ **KV 存储**: 用于缓存（可选）

详细文档请查看：
- [后端 README](./backend/README.md)
- [D1 数据库设置](./backend/D1_SETUP.md)
- [Cloudflare + HeyAPI 集成指南](./CLOUDFLARE_HEYAPI_GUIDE.md)
