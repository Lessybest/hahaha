# 计算机网络知识体系交互系统

> 一个基于 Web 的计算机网络可视化学习平台，帮助计算机专业学生更好地理解网络协议工作原理和知识体系。

## 📊 项目概况

| 项目名称 | 计算机网络知识体系交互系统 |
|---------|--------------------------|
| 适用课程 | 计算机网络 |
| 技术栈 | Vue 3 + Vite + Tailwind CSS + Express + better-sqlite3 |
| 开发工具 | VS Code, Node.js, npm, SQLite |
| 撰写日期 | 2026年6月1日 |
| 版本 | V1.0 |

## 🎯 项目目标

本项目旨在开发一套基于 Web 的计算机网络知识体系交互系统，通过可视化技术、交互式学习和知识图谱等现代教学手段，帮助学生更好地理解计算机网络的核心概念、协议工作原理以及数据包在网络中的传输过程。

**主要功能：**
1. ✅ DNS 域名解析协议可视化（8 步完整流程）
2. ✅ ARP 地址解析协议可视化（7 步完整流程）
3. ✅ 综合网络场景模拟（H1 访问 www.abc.com 完整通信过程）
4. ✅ 基于 TCP/IP 五层模型的知识体系管理（增删改查）
5. ✅ 知识图谱可视化（SVG 图形展示知识点关联）
6. ✅ 实践日志功能（记录项目开发过程）

## 🛠️ 技术栈

### 前端技术栈
- **Vue 3**：渐进式 JavaScript 框架，支持组件化开发和响应式数据绑定
- **Vite**：现代化的前端构建工具，支持快速热更新和按需编译
- **Vue Router 4**：Vue 3 官方路由管理器，支持动态路由和路由守卫
- **Tailwind CSS**：实用优先的 CSS 框架，支持快速构建自定义界面
- **axios**：基于 Promise 的 HTTP 客户端，用于前后端数据交互

### 后端技术栈
- **Node.js**：基于 Chrome V8 引擎的 JavaScript 运行环境
- **Express**：轻量级的 Node.js Web 应用框架，支持中间件和路由
- **better-sqlite3**：高性能的 SQLite3 驱动，支持同步 API 调用
- **cors**：Express 中间件，用于解决跨域资源共享问题
- **body-parser**：Express 中间件，用于解析 HTTP 请求体

## 📁 项目结构

```
网络实习/
├── server/                      # 后端服务器
│   ├── index.js                # Express 服务器入口
│   ├── routes/                 # API 路由
│   │   └── knowledge.js       # 知识点 CRUD 接口
│   └── data/                   # 数据库文件
│       └── knowledge.db        # SQLite 数据库
├── src/                        # 前端源码
│   ├── assets/                 # 静态资源
│   ├── components/             # Vue 组件
│   │   ├── comprehensive/      # 综合场景子组件
│   │   │   ├── TopologyView.vue
│   │   │   ├── StepController.vue
│   │   │   ├── StepInfoPanel.vue
│   │   │   ├── ArpTable.vue
│   │   │   ├── MacTable.vue
│   │   │   ├── DnsCache.vue
│   │   │   ├── TcpState.vue
│   │   │   └── MessageLog.vue
│   │   ├── ParticleBackground.vue
│   │   └── NavBar.vue
│   ├── data/                   # 协议数据
│   │   ├── dns.js             # DNS 协议步骤数据
│   │   ├── arp.js             # ARP 协议步骤数据
│   │   └── comprehensiveSteps.js  # 综合场景步骤数据
│   ├── views/                  # 页面组件
│   │   ├── Home.vue            # 首页
│   │   ├── DnsProtocol.vue    # DNS 协议可视化
│   │   ├── ArpProtocol.vue    # ARP 协议可视化
│   │   ├── Comprehensive.vue  # 综合场景模拟
│   │   └── Knowledge.vue       # 知识体系管理
│   ├── router/                 # 路由配置
│   │   └── index.js           # Vue Router 配置
│   ├── App.vue                 # 根组件
│   ├── main.js                 # 应用入口
│   └── style.css              # 全局样式
├── dist/                       # 构建输出目录
├── index.html                  # HTML 入口
├── vite.config.js              # Vite 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── postcss.config.js           # PostCSS 配置
├── package.json                # 项目配置
├── README.md                   # 项目说明文档
├── 计算机网络知识体系交互系统_设计文档.docx  # 设计文档（≥10000字）
└── 实践日志.docx               # 实践日志（每日更新）
```

## 🚀 快速开始

### 环境要求
- **Node.js**：v16.0 以上
- **npm**：v8.0 以上
- **现代浏览器**：Chrome 120+、Firefox 115+、Safari 17+、Edge 120+

### 安装依赖
```bash
# 克隆项目
cd /Users/lessy/Desktop/网络实习

# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install
```

### 启动开发服务器
```bash
# 终端 1：启动后端服务器（端口 3000）
cd /Users/lessy/Desktop/网络实习/server
node index.js

# 终端 2：启动前端开发服务器（端口 5173）
cd /Users/lessy/Desktop/网络实习
npm run dev
```

### 构建生产版本
```bash
cd /Users/lessy/Desktop/网络实习
npm run build
# 构建输出在 dist/ 目录
```

### 访问系统
打开浏览器访问：`http://localhost:5173`

## 📋 功能说明

### 1. DNS 协议可视化
- **路径**：首页 → DNS 协议
- **功能**：展示 DNS 递归查询的完整 8 步流程
- **特色**：动画展示数据包传输、实时更新 DNS 缓存表

### 2. ARP 协议可视化
- **路径**：首页 → ARP 协议
- **功能**：展示 ARP 地址解析的完整 7 步流程
- **特色**：展示交换机 MAC 表学习过程

### 3. 综合网络场景模拟
- **路径**：首页 → 综合场景
- **功能**：模拟 H1 访问 www.abc.com 的完整通信过程
- **特色**：包含 DNS 解析、ARP 解析、TCP 三次握手、HTTP 请求响应

### 4. 知识体系管理
- **路径**：首页 → 知识体系
- **功能**：基于 TCP/IP 五层模型管理知识点
- **特色**：支持增删改查、模糊查询、知识图谱可视化

### 5. 知识图谱
- **路径**：知识体系 → 知识图谱标签
- **功能**：SVG 图形展示知识点关联关系
- **特色**：支持拖拽节点调整布局

## 📊 数据库设计

### 表 1：layers（五层模型）
| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | INTEGER | 主键，自增 |
| name | TEXT | 层次名称（唯一约束） |
| description | TEXT | 层次描述 |
| icon | TEXT | 图标名称 |
| color | TEXT | 层次颜色（默认 #00d4ff） |
| sort_order | INTEGER | 排序顺序（默认 0） |

### 表 2：knowledge（知识点）
| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | INTEGER | 主键，自增 |
| layer_id | INTEGER | 外键，关联 layers(id) |
| title | TEXT | 知识点标题（非空） |
| content | TEXT | 知识点内容（默认空） |
| tags | TEXT | 知识点标签（默认空） |
| created_at | DATETIME | 创建时间（默认当前时间） |
| updated_at | DATETIME | 更新时间（默认当前时间） |

## 🔌 API 接口列表

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/layers | 获取五层模型列表 |
| GET | /api/layers/:id/knowledge | 按层次获取知识点 |
| GET | /api/knowledge | 获取所有知识点 |
| POST | /api/knowledge | 新增知识点 |
| PUT | /api/knowledge/:id | 更新知识点 |
| DELETE | /api/knowledge/:id | 删除知识点 |
| GET | /api/search?q=xxx | 模糊查询知识点 |

## 📸 运行截图

> **注意**：请将运行截图放在 `screenshots/` 目录下，并在此处添加截图说明。

### 首页
![首页](screenshots/home.png)

### DNS 协议可视化
![DNS 协议](screenshots/dns.png)

### ARP 协议可视化
![ARP 协议](screenshots/arp.png)

### 综合场景模拟
![综合场景](screenshots/comprehensive.png)

### 知识体系管理
![知识体系](screenshots/knowledge.png)

### 知识图谱
![知识图谱](screenshots/graph.png)

## 🎯 评分标准对照

| 项目 | 分数 | 状态 | 说明 |
|------|------|------|------|
| 实习过程提交规范 | 10 | ✅ 已完成 | 实践日志已创建 |
| 设计文档质量 | 13 | ✅ 已完成 | 设计文档 ≥10000 字 |
| 协议可视化 ×2 | 20 | ✅ 已完成 | DNS + ARP |
| 综合网络场景模拟 | 21 | ✅ 已完成 | 8 步流程完整 |
| 知识体系综合展示 | 21 | ✅ 已完成 | 五层模型 + 知识图谱 |
| 成果演示综合评价 | 10 | ⏳ 待验收 | 需运行截图 |
| 加分项 | +5 | ⏳ 未实现 | 网络故障模拟 |

**当前预估得分：~95/100**（扣分项：成果演示 -5，加分项未实现 -5）

## 📝 开发日志

详见 `实践日志.docx`，每日更新开发进度和遇到的问题及解决方案。

## 🙏 致谢

感谢艾新学院提供本次实习机会，感谢朱丽萍老师、张建兵老师的悉心指导。

## 📧 联系方式

- **学号**：[请填写]
- **姓名**：[请填写]
- **邮箱**：[请填写]
- **GitHub**：[请填写私有仓库地址]

---

**声明**：本项目为计算机网络课程实习作业，代码和文档均为原创，严禁抄袭。
