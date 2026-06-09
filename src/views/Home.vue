<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Three.js Particle Background -->
    <ParticleBackground />

    <!-- Hero Section -->
    <section class="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-6 pt-16 pb-8">
      <div class="fade-up stagger-1 text-center max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-primary/30 bg-accent-primary/10 text-xs text-accent-primary mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
          2026 李思绎的网络实习 · 计算机科学与技术
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          <span class="text-gradient">计算机网络</span><br/>
          知识体系交互展示系统
        </h1>
        <p class="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          用可视化方式深入理解 DNS、ARP、TCP/IP 五层模型的运行原理。
          理论与交互结合，协议不再抽象。
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <router-link to="/dns" class="btn-primary text-sm">
            体验DNS协议 →
          </router-link>
          <router-link to="/arp" class="btn-secondary text-sm">
            体验ARP协议
          </router-link>
        </div>
      </div>
    </section>

    <!-- Protocol Cards -->
    <section class="relative z-10 px-6 pb-16 max-w-5xl mx-auto">
      <h2 class="text-lg font-semibold text-text-muted uppercase tracking-widest mb-6 text-center fade-up stagger-2">
        核心功能模块
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- DNS Card -->
        <router-link to="/dns" class="glass-card card-hover p-6 fade-up stagger-3 block">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" stroke="#00d4ff" stroke-width="1.5"/>
                <path d="M10 2v3M10 15v3M2 10h3M15 10h3" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="10" cy="10" r="7" stroke="#00d4ff" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base mb-1 text-text-primary">DNS域名解析</h3>
              <p class="text-text-muted text-sm leading-relaxed">
                模拟客户端向DNS服务器查询域名的全过程，支持缓存命中/未命中两种场景，展示UDP查询与响应的数据流向。
              </p>
              <div class="flex gap-2 mt-3 flex-wrap">
                <span class="text-xs px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary border border-accent-primary/30">UDP/53</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">递归查询</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">缓存模拟</span>
              </div>
            </div>
          </div>
        </router-link>

        <!-- ARP Card -->
        <router-link to="/arp" class="glass-card card-hover p-6 fade-up stagger-4 block">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-accent-warning/15 border border-accent-warning/30 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="8" width="16" height="4" rx="2" stroke="#f59e0b" stroke-width="1.5"/>
                <path d="M6 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#f59e0b" stroke-width="1.5"/>
                <path d="M6 12v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" stroke="#f59e0b" stroke-width="1.5"/>
                <path d="M10 5v2" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base mb-1 text-text-primary">ARP地址解析</h3>
              <p class="text-text-muted text-sm leading-relaxed">
                展示ARP Request广播与ARP Reply单播的完整过程，动态呈现交换机MAC地址表的学习与更新机制。
              </p>
              <div class="flex gap-2 mt-3 flex-wrap">
                <span class="text-xs px-2 py-0.5 rounded-full bg-accent-warning/15 text-accent-warning border border-accent-warning/30">广播Request</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-accent-success/15 text-accent-success border border-accent-success/30">单播Reply</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">MAC表学习</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Second Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Comprehensive Scene Card -->
        <router-link to="/comprehensive" class="glass-card card-hover p-6 fade-up stagger-5 block">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-accent-secondary/15 border border-accent-secondary/30 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1" stroke="#7c3aed" stroke-width="1.5"/>
                <rect x="12" y="2" width="6" height="6" rx="1" stroke="#7c3aed" stroke-width="1.5"/>
                <rect x="2" y="12" width="6" height="6" rx="1" stroke="#7c3aed" stroke-width="1.5"/>
                <rect x="12" y="12" width="6" height="6" rx="1" stroke="#7c3aed" stroke-width="1.5"/>
                <path d="M8 5h4M5 8v4M15 8v4M8 15h4" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base mb-1 text-text-primary">综合网络场景模拟</h3>
              <p class="text-text-muted text-sm leading-relaxed">
                H1访问 www.abc.com 的完整通信过程拆解，包含DNS解析、ARP查询、TCP连接、HTTP请求，覆盖从t0到t1的每一步。
              </p>
              <div class="flex gap-2 mt-3 flex-wrap">
                <span class="text-xs px-2 py-0.5 rounded-full bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30">多协议联动</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">7步以上</span>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Knowledge System Card -->
        <router-link to="/knowledge" class="glass-card card-hover p-6 fade-up stagger-6 block">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-accent-success/15 border border-accent-success/30 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 6l8 4 8-4-8-4z" stroke="#10b981" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 10l8 4 8-4" stroke="#10b981" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 14l8 4 8-4" stroke="#10b981" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base mb-1 text-text-primary">TCP/IP五层模型知识体系</h3>
              <p class="text-text-muted text-sm leading-relaxed">
                结构化的网络知识学习模块，支持增删改查，内置知识图谱展示各层协议与概念的层次关系，数据持久化存储。
              </p>
              <div class="flex gap-2 mt-3 flex-wrap">
                <span class="text-xs px-2 py-0.5 rounded-full bg-accent-success/15 text-accent-success border border-accent-success/30">知识图谱</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">CRUD</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">数据库</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Internship Progress Card -->
      <div class="mt-12 fade-up stagger-6">
        <div class="glass-card p-6 max-w-2xl mx-auto">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-semibold text-text-primary">实习进度</h3>
            <span class="text-xs px-2.5 py-1 rounded-full bg-accent-success/15 text-accent-success border border-accent-success/30 font-medium">
              ● 已完成
            </span>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-4 gap-4 mb-5">
            <div class="text-center">
              <div class="text-2xl font-bold text-accent-primary">10</div>
              <div class="text-[10px] text-text-muted mt-0.5">开发周期(天)</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-accent-success">5/5</div>
              <div class="text-[10px] text-text-muted mt-0.5">完成模块</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-accent-secondary">100%</div>
              <div class="text-[10px] text-text-muted mt-0.5">完成度</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-accent-warning">17</div>
              <div class="text-[10px] text-text-muted mt-0.5">知识点</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="h-2 rounded-full bg-white/5 overflow-hidden mb-5">
            <div class="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-success transition-all duration-1000" style="width: 100%"></div>
          </div>

          <!-- Module Tags -->
          <div class="flex flex-wrap gap-2 mb-5">
            <span class="text-xs px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">✓ DNS协议</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-accent-warning/10 text-accent-warning border border-accent-warning/20">✓ ARP协议</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">✓ 综合场景</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-accent-success/10 text-accent-success border border-accent-success/20">✓ 知识体系</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-white/5 text-text-muted border border-white/10">✓ 知识图谱</span>
          </div>

          <button
            class="w-full py-2.5 rounded-lg border border-border-subtle text-sm text-text-secondary hover:text-text-primary hover:border-accent-primary/40 hover:bg-accent-primary/5 transition-all duration-200 cursor-pointer"
            @click="showTimeline = true"
          >
            查看完整开发历程 →
          </button>
        </div>
      </div>
    </section>

    <!-- Timeline Modal -->
    <Teleport to="body">
      <div v-if="showTimeline" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showTimeline = false">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative glass-card w-full max-w-2xl max-h-[85vh] flex flex-col" style="background: rgba(15,15,24,0.95);">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-5 border-b border-white/5">
            <div>
              <h2 class="text-lg font-bold text-text-primary">开发历程</h2>
              <p class="text-xs text-text-muted mt-0.5">10天 · 从需求分析到项目验收</p>
            </div>
            <button class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer" @click="showTimeline = false">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>

          <!-- Timeline Content -->
          <div class="flex-1 overflow-y-auto p-5 space-y-0">
            <div v-for="(day, idx) in timeline" :key="idx" class="relative pl-8 pb-8 last:pb-0">
              <!-- Vertical Line -->
              <div v-if="idx < timeline.length - 1" class="absolute left-[11px] top-6 bottom-0 w-px" :class="day.done ? 'bg-accent-success/30' : 'bg-white/10'"></div>
              <!-- Node Dot -->
              <div class="absolute left-0 top-1 w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center"
                :class="day.done ? 'border-accent-success bg-accent-success/15' : 'border-white/20 bg-white/5'">
                <div v-if="day.done" class="w-2 h-2 rounded-full bg-accent-success"></div>
                <div v-else class="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              <!-- Day Content -->
              <div class="ml-3">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="text-sm font-bold" :class="day.done ? 'text-accent-success' : 'text-text-muted'">Day{{ idx + 1 }}</span>
                  <span class="text-xs text-text-muted">·</span>
                  <span class="text-xs text-text-secondary">{{ day.phase }}</span>
                </div>
                <div class="glass-card p-4" style="background: rgba(255,255,255,0.03);">
                  <h4 class="text-sm font-semibold text-text-primary mb-2">{{ day.task }}</h4>
                  <ul class="space-y-1">
                    <li v-for="item in day.outputs" :key="item" class="text-xs text-text-muted flex items-start gap-1.5">
                      <span class="mt-0.5 text-accent-success shrink-0">✓</span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ParticleBackground from '@/components/ParticleBackground.vue'

const showTimeline = ref(false)

const timeline = [
  {
    done: true,
    phase: '需求分析',
    task: '阅读实习任务书，明确项目目标与技术方案',
    outputs: ['研读实习指导书，梳理评分标准与提交要求', '确定DNS+ARP双协议可视化方向', '选定Vue 3 + Vite + Tailwind CSS + SQLite技术栈', '完成项目总体架构设计']
  },
  {
    done: true,
    phase: '项目搭建',
    task: '初始化Vue项目，配置开发环境与路由',
    outputs: ['Vite + Vue 3项目脚手架搭建', 'Tailwind CSS毛玻璃主题配置', 'Vue Router五页面路由注册（懒加载）', '首页设计与Three.js粒子背景集成']
  },
  {
    done: true,
    phase: 'DNS协议开发',
    task: 'DNS协议可视化核心功能开发',
    outputs: ['5节点SVG拓扑图（客户端/本地DNS/根/TLD/权威）', '9步递归查询流程数据结构设计', 'TopoCanvas组件封装（节点高亮+数据包动画）', 'StepIndicator步骤进度条组件']
  },
  {
    done: true,
    phase: 'DNS完善',
    task: 'DNS缓存机制与报文展示优化',
    outputs: ['缓存命中/未命中双场景切换', 'DNS缓存表Before→After对比展示', '报文字段解析（源/目的IP、MAC、协议）', '域名输入框与自动播放控制']
  },
  {
    done: true,
    phase: 'ARP协议开发',
    task: 'ARP协议可视化全流程开发',
    outputs: ['7节点拓扑（主机A/B/交换机/广播域）', '8步ARP生命周期（含结果汇总）', 'ARP缓存表Before/After动态对比', '交换机MAC表学习与更新联动']
  },
  {
    done: true,
    phase: '综合场景设计',
    task: '综合网络场景模拟架构设计',
    outputs: ['H1访问www.lessybest.com全流程规划', 'ARP→DNS→TCP→HTTP四协议串联方案', '三表联动设计（ARP表/MAC表/DNS缓存）', '协议栈逐层封装可视化方案']
  },
  {
    done: true,
    phase: '综合场景开发',
    task: '综合场景核心功能实现',
    outputs: ['8步综合场景完整实现', 'ARP表/MAC表/DNS缓存表三表联动', 'TCP连接状态跟踪组件', '通信日志实时记录系统']
  },
  {
    done: true,
    phase: '知识体系开发',
    task: '知识体系模块与后端API开发',
    outputs: ['SQLite数据库设计（layers + knowledge双表）', 'Express RESTful API（7个接口）', '知识点CRUD前端交互', '5层17条预置知识数据']
  },
  {
    done: true,
    phase: '知识图谱',
    task: '知识图谱可视化与搜索功能',
    outputs: ['SVG交互图谱（分层/力导向双布局）', '节点拖拽与悬停信息展示', '模糊搜索功能（标题/内容/标签）', '数据持久化验证（新增→刷新→数据保留）']
  },
  {
    done: true,
    phase: '测试验收',
    task: '系统联调、文档编写与项目验收',
    outputs: ['全模块功能联调与Bug修复', 'npm run build构建通过（95模块0错误）', 'README文档编写（13章节完整技术文档）', 'Git仓库提交与答辩验收测试通过']
  }
]
</script>
