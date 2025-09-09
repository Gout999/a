# CityU LearnSphere

AI驱动的个人知识管理与科研协作Web应用

## 项目概述

CityU LearnSphere 是一个专为香港城市大学师生设计的智能知识管理与科研协作平台。平台融合AI技术与香港本土文化特色，提供个性化学习体验和高效的科研协作环境。

## 核心功能

- 🧠 **智能文档管理与双向链接** - Markdown编辑器，支持知识网络化管理
- 🤖 **AI个性化学习助手** - 基于deepseek API的智能对话系统
- 👥 **科研协作与文献管理** - 团队协作空间和文献管理工具
- 📅 **智能时间管理与香港文化日历** - 融入香港传统节日的时间管理
- 🏛️ **虚拟校园文化体验** - CityU校园导览和香港文化展示
- 🌐 **中英双语支持** - 完整的国际化界面

## 技术栈

### 前端
- **框架**: React.js 18+ (TypeScript)
- **样式**: TailwindCSS + Ant Design
- **状态管理**: React Context + useReducer
- **路由**: React Router v6
- **Markdown**: react-markdown

### 后端 (计划中)
- **运行环境**: Node.js 18+
- **框架**: Express.js + TypeScript
- **数据库**: MongoDB + Mongoose
- **AI集成**: deepseek API

### 开发工具
- **开发环境**: CodeBuddy IDE
- **版本控制**: CNB代码平台
- **部署平台**: Cloud Studio
- **容器化**: Docker

## 设计特色

- **CityU品牌色彩**: 主色调 #0066CC，强调色 #FF6B35
- **现代学院风格**: 卡片式布局，圆角设计，柔和阴影
- **香港文化元素**: 融入维港、茶餐厅等本土文化符号
- **响应式设计**: 支持桌面端、平板端、移动端

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 演示账号

- **邮箱**: student@cityu.edu.hk
- **密码**: password123

## 项目结构

```
src/
├── components/          # 组件
│   ├── auth/           # 认证相关组件
│   ├── layout/         # 布局组件
│   └── ui/             # UI组件
├── hooks/              # 自定义Hook
├── pages/              # 页面组件
│   ├── auth/           # 认证页面
│   └── dashboard/      # 仪表板页面
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
└── assets/             # 静态资源
```

## 开发计划

- [x] 实现用户认证系统和个人资料管理功能
- [ ] 开发文档管理系统，包含Markdown编辑器和双向链接功能
- [ ] 集成deepseek API构建AI学习助手对话界面
- [ ] 创建科研协作空间，包含项目管理和文献管理工具
- [ ] 开发智能时间管理系统和香港文化日历功能
- [ ] 构建虚拟校园导览和香港文化体验模块
- [ ] 实现中英双语国际化支持和响应式界面适配

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目链接: [https://github.com/your-username/cityu-learnsphere](https://github.com/your-username/cityu-learnsphere)
- 问题反馈: [Issues](https://github.com/your-username/cityu-learnsphere/issues)

---

Made with ❤️ for CityU Community