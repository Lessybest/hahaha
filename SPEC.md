# 网络实习 — 计算机网络知识体系交互式展示系统

## 1. Concept & Vision

融合个人网站的沉浸式暗色美学 + Apple官网的极简毛玻璃风格，打造一个让人愿意停留的网络原理学习平台。不是枯燥的教科书翻版，而是**用视觉讲故事**——协议不再是无序的编号，而是有生命的数据包，在拓扑中穿梭、在状态机中跃迁。整体氛围：**科技感 × 学术严谨 × Apple级精致**。

---

## 2. Design Language

### 色彩系统
```
背景主色:    #0a0a0f      (深空黑，接近个人网站底色)
次背景:      #111118      (卡片/面板背景)
卡片色:      rgba(255,255,255,0.06)   (毛玻璃基底)
边框色:      rgba(255,255,255,0.10)
主色调:      #00d4ff      (网络/科技蓝cyan)
强调色:      #7c3aed      (紫色，用于hover/高亮)
成功色:      #10b981      (绿色，连接建立/成功状态)
警告色:      #f59e0b      (橙色，广播/警告)
文字主色:    #f0f0f5
文字次色:    rgba(240,240,245,0.6)
文字暗色:    rgba(240,240,245,0.4)
```

### 字体
- **标题**: `Inter` (700/800) 或本地 `SF Pro Display` fallback
- **正文/UI**: `Inter` (400/500)
- **代码/终端**: `JetBrains Mono` 或 `SF Mono`

### 动效哲学
- **进入**: opacity 0→1 + translateY(20px→0), 500ms ease-out, items stagger 80ms
- **Hover**: scale(1.02) + border-color变亮, 200ms ease
- **数据包动画**: 沿SVG路径运动，带尾迹（motion blur效果）
- **拓扑节点**: 脉冲光晕（subtle glow pulse）
- **页面切换**: 淡入淡出，200ms
- **滚动**: 平滑滚动，section之间有视觉缓冲

### 视觉资产
- 图标库: Lucide Icons (stroke-based, 1.5px, 干净)
- 网络拓扑: 自定义SVG/Canvas绘制（圆形节点 + 线条连接）
- 背景: Three.js粒子星空（继承个人网站风格，可调暗）

---

## 3. Layout & Structure

### 整体结构
```
┌──────────────────────────────────────┐
│  导航栏 (毛玻璃，固定顶部)            │
│  Logo · DNS · ARP · 综合场景 · 知识体系 │
├──────────────────────────────────────┤
│                                      │
│           Three.js 粒子背景             │
│                                      │
│    ┌────────────────────────────┐    │
│    │     首页 Hero Section       │    │
│    │  计算机网络知识体系交互展示系统   │    │
│    └────────────────────────────┘    │
│                                      │
│    ┌────────┐  ┌────────┐            │
│    │ DNS    │  │  ARP   │  ...      │  ← 功能卡片网格
│    └────────┘  └────────┘            │
│                                      │
│    ┌────────────────────────────┐    │
│    │     综合场景模拟卡片          │    │
│    └────────────────────────────┘    │
│                                      │
│    ┌────────────────────────────┐    │
│    │     TCP/IP五层模型          │    │
│    └────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

### 协议可视化页面结构（DNS / ARP）
```
┌──────────────────────────────────────┐
│  导航栏                              │
├──────────────────────────────────────┤
│  页面标题 + 简介                      │
├──────────────────┬───────────────────┤
│                  │                   │
│   网络拓扑画布    │   控制面板         │
│   (SVG交互图)    │   [开始] [下一步]  │
│                  │   [重置]           │
│                  │   ─────────────   │
│                  │   步骤说明文字     │
│                  │   状态表格         │
│                  │                   │
├──────────────────┴───────────────────┤
│   协议细节/报文结构说明                │
└──────────────────────────────────────┘
```

### 响应式策略
- Desktop (>1024px): 左右分栏拓扑+控制面板
- Tablet (768-1024px): 拓扑在上，控制面板在下
- Mobile (<768px): 全部垂直堆叠，拓扑可缩放拖拽

---

## 4. Features & Interactions

### 首页
- Three.js粒子星空背景（可交互：鼠标移动扰动粒子）
- 4个主功能卡片（DNS / ARP / 综合场景 / 知识体系），hover时边框发光+轻微上浮
- Apple风格的毛玻璃导航栏，滚动时背景加深

### DNS协议可视化（题目1）
- **拓扑节点**: 客户端主机（带IP地址显示）、DNS服务器
- **输入框**: 供用户输入域名
- **步骤流程**（以`www.example.com`为例）：
  1. **Step 1**: 客户端发送DNS查询报文（UDP, 端口53）→ 箭头动画
  2. **Step 2**: DNS服务器接收，查询本地缓存/数据库
  3. **Step 3**: DNS服务器返回响应报文（含TTL）→ 箭头动画
  4. **Step 4**: 客户端更新ARP表（如果MAC未知先走ARP）
  5. **Step 5**: 显示最终解析IP，DNS缓存表更新
- **广播/单播**: 不同颜色箭头（广播=橙色，单播=青色）
- **状态展示**: 域名→IP映射结果表格
- **缓存模拟**: 支持"缓存命中" vs "缓存未命中"两种分支展示

### ARP协议可视化（题目3）
- **拓扑节点**: 源主机（IP已知，MAC未知）、交换机、目标主机
- **初始状态**: 源主机ARP表为空，目标主机MAC未知
- **步骤流程**：
  1. **Step 1**: 源主机已知目标IP，不知道MAC → 触发ARP
  2. **Step 2**: ARP Request **广播**（ff:ff:ff:ff:ff:ff）→ 橙色广播动画，泛洪到所有节点
  3. **Step 3**: 目标主机收到Request，单播ARP Reply → 青色单播动画
  4. **Step 4**: 源主机收到Reply，更新ARP缓存表（IP→MAC映射）
  5. **Step 5**: 交换机更新MAC地址表
- **表格动态更新**: ARP表 + MAC表实时显示变化（高亮闪烁）
- **输入IP**: 用户可输入目标IP观察ARP请求

### 综合场景模拟（题目2）
- **拓扑**: H1 + 交换机S + 本地DNS服务器 + 路由器R + Internet + Web服务器
- **完整流程**（参考指导书t0到t1过程）：
  1. H1查DNS缓存 → 未命中
  2. H1查路由表 → 需要DNS服务器MAC → ARP请求
  3. H1发送DNS查询（UDP）→ DNS服务器
  4. DNS服务器返回IP
  5. H1需要网关MAC → ARP请求
  6. ARP Reply → H1得到网关MAC
  7. 建立TCP连接 → HTTP请求 → 响应
- **分步骤展示**: 每个步骤独立显示，包含：协议、源/目的MAC、源/目的IP、广播/单播、交换机行为、ARP表变化、MAC表变化
- **路径高亮**: 当前步骤的传输路径在拓扑图中高亮

### TCP/IP五层模型知识体系（题目3）
- **6个标签页**: 应用层 / 传输层 / 网络层 / 数据链路层 / 物理层 / 知识图谱
- **每层内容**: 主要功能 + 常见协议 + 相关设备 + 知识点列表
- **数据库**: SQLite存储知识点，支持增删改查
- **知识图谱**: D3.js力导向图或EChartsGraph，展示知识点层次关系

### 通用交互
- `[开始]`: 从Step 1开始自动播放动画
- `[下一步]`: 前进一个步骤
- `[上一步]`: 后退一个步骤
- `[重置]`: 恢复初始状态
- **速度控制**: 动画速度可调（0.5x / 1x / 2x）
- **步骤跳转**: 点击侧边步骤列表直接跳转

---

## 5. Component Inventory

### NavBar
- 毛玻璃背景（backdrop-filter: blur(20px)）
- Logo + 4个导航链接
- 滚动时背景加深
- 移动端: 汉堡菜单 → 侧边抽屉

### TopoCanvas（网络拓扑画布）
- SVG绘制，节点为圆形，连接为线条
- 节点hover: 光晕放大 + tooltip显示IP/MAC
- 选中节点: 边框高亮
- 数据包: 沿路径运动的小圆点，带颜色和标签

### StepIndicator（步骤指示器）
- 步骤编号圆圈 + 标题 + 当前步骤高亮
- 完成步骤: 绿色勾号
- 当前步骤: 主色调填充+脉冲动画
- 未完成: 灰色

### PacketInfoPanel（报文信息面板）
- 表格展示当前步骤的关键信息
- 字段高亮（颜色编码：源MAC绿色、目的MAC蓝色、协议字段紫色）
- 动画过渡效果

### StatusTable（状态表格 - ARP表/MAC表）
- 动态行插入（高亮闪烁）
- 行更新时背景短暂变绿
- 空状态: 虚线边框 + "暂无数据"

### ProtocolCard（首页功能卡片）
- 毛玻璃背景 + 细边框
- 图标 + 标题 + 简介
- Hover: 边框变亮 + translateY(-4px) + box-shadow扩散
- 点击: 跳转到对应页面

### KnowledgeGraph（知识图谱）
- D3.js力导向图
- 节点: 按层级着色（应用层=蓝、传输层=绿...）
- 节点hover: 显示详情tooltip
- 节点点击: 展开子节点

---

## 6. Technical Approach

### 技术栈
```
Frontend:   Vue 3 (Composition API) + Vite + Vue Router
Styling:    Tailwind CSS v3 + CSS Variables（自定义暗色主题）
Animation:  GSAP（协议动画）+ Three.js（背景粒子）
Backend:    Node.js + Express
Database:   SQLite（better-sqlite3）
Build:      Vite build，输出静态文件由Express托管
```

### 项目结构
```
~/Desktop/网络实习/
├── SPEC.md
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── server/
│   ├── index.js          # Express服务器入口
│   ├── db.js             # SQLite连接 + 建表
│   └── routes/
│       └── knowledge.js  # 知识体系API
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── Home.vue          # 首页
│   │   ├── DnsProtocol.vue   # DNS协议可视化
│   │   ├── ArpProtocol.vue   # ARP协议可视化
│   │   ├── Comprehensive.vue # 综合场景模拟
│   │   └── Knowledge.vue     # 五层模型+知识图谱
│   ├── components/
│   │   ├── NavBar.vue
│   │   ├── TopoCanvas.vue
│   │   ├── StepIndicator.vue
│   │   ├── PacketInfoPanel.vue
│   │   ├── StatusTable.vue
│   │   ├── ProtocolCard.vue
│   │   └── ParticleBackground.vue
│   ├── composables/
│   │   └── useProtocol.js   # 协议动画通用逻辑
│   └── data/
│       ├── dns.js           # DNS步骤数据
│       └── arp.js           # ARP步骤数据
└── data/
    └── knowledge.db         # SQLite数据库
```

### API设计
```
GET    /api/layers                      # 获取所有层及知识点
GET    /api/layers/:id/knowledge        # 获取某层知识点
POST   /api/knowledge                   # 新增知识点
PUT    /api/knowledge/:id               # 更新知识点
DELETE /api/knowledge/:id                # 删除知识点
GET    /api/search?q=关键词             # 模糊搜索知识点
```

### 数据库设计
```sql
CREATE TABLE layers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,        -- 层名称（应用层/传输层/...）
  description TEXT,
  icon TEXT,
  color TEXT                 -- 配色hex
);

CREATE TABLE knowledge (
  id INTEGER PRIMARY KEY,
  layer_id INTEGER,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT,                 -- 逗号分隔标签
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (layer_id) REFERENCES layers(id)
);
```

---

## 7. Milestones

| 日期 | 目标 |
|------|------|
| 6.1 (今天) | 项目初始化 + 首页框架 + 粒子背景 + 导航 |
| 6.2 | DNS协议可视化完整功能 |
| 6.2-6.5 | ARP协议可视化完整功能 |
| 6.5 | 综合场景模拟（可扩展）|
| 6.8 | TCP/IP五层模型 + 数据库 + 增删改查 |
| 6.9 | 知识图谱 |
| 6.12 | 完善文档、README、测试、提交 |
