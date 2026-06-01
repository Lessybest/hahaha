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

      <!-- Timeline -->
      <div class="mt-12 text-center fade-up stagger-6">
        <div class="inline-flex flex-col items-center gap-3 glass-card px-6 py-4">
          <div class="text-xs text-text-muted">实习进度</div>
          <div class="flex items-center gap-1">
            <div v-for="i in 10" :key="i"
              class="w-6 h-1.5 rounded-full transition-all duration-300"
              :class="i <= 1 ? 'bg-accent-primary' : 'bg-white/10'"
            ></div>
          </div>
          <div class="text-xs text-text-secondary">第1天 / 共10天 · 需求分析与项目规划</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ParticleBackground from '@/components/ParticleBackground.vue'
</script>
