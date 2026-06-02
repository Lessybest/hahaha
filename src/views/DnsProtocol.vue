<template>
  <div class="min-h-screen px-4 md:px-8 pb-16 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="pt-8 pb-6 fade-up">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="#00d4ff" stroke-width="1.5"/>
            <path d="M8 1v2.5M8 12.5v2.5M1 8h2.5M12.5 8H15" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold">DNS域名解析</h1>
      </div>
      <p class="text-text-secondary text-sm">
        模拟客户端向DNS服务器发起域名查询请求，展示DNS递归查询与缓存命中/未命中的完整过程。
      </p>
    </div>

    <!-- Domain Input + Cache Mode -->
    <div class="glass-card p-4 mb-6 fade-up stagger-1">
      <div class="flex flex-col sm:flex-row gap-3 items-center mb-3">
        <label class="text-sm text-text-muted shrink-0">输入要查询的域名：</label>
        <input
          v-model="domainInput"
          type="text"
          class="flex-1 bg-white/5 border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary transition-colors font-mono"
          placeholder="例如：www.lessybest.com"
          @keyup.enter="handleStart"
        />
        <button class="btn-primary text-sm shrink-0" @click="handleStart" :disabled="isPlaying">
          发起查询
        </button>
      </div>
      <!-- Cache mode selector -->
      <div class="flex items-center gap-3 text-xs">
        <span class="text-text-muted">缓存状态模拟：</span>
        <button
          class="px-3 py-1 rounded-lg border transition-all"
          :class="cacheMode === 'miss' ? 'bg-accent-primary/20 border-accent-primary/40 text-accent-primary' : 'border-border-subtle text-text-muted hover:border-border-hover'"
          @click="switchCacheMode('miss')"
        >缓存未命中（完整递归查询）</button>
        <button
          class="px-3 py-1 rounded-lg border transition-all"
          :class="cacheMode === 'hit' ? 'bg-accent-success/20 border-accent-success/40 text-accent-success' : 'border-border-subtle text-text-muted hover:border-border-hover'"
          @click="switchCacheMode('hit')"
        >缓存命中（直接返回）</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Topology + Controls -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Topology -->
        <div class="glass-card p-4 fade-up stagger-2">
          <TopoCanvas
            :nodes="dnsNodes"
            :connections="dnsConnections"
            :current-step="currentStep"
          />
        </div>

        <!-- Controls -->
        <div class="glass-card p-4 fade-up stagger-3">
          <div class="flex flex-wrap gap-2 items-center mb-4">
            <button class="btn-primary text-sm" @click="handleStart" :disabled="isPlaying">
              <span class="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5V2z"/></svg>
                开始
              </span>
            </button>
            <button class="btn-secondary text-sm" @click="handleNext" :disabled="isPlaying || currentStepIndex >= activeSteps.length - 1">
              下一步
            </button>
            <button class="btn-secondary text-sm" @click="handlePrev" :disabled="isPlaying || currentStepIndex <= 0">
              上一步
            </button>
            <button class="btn-ghost text-sm" @click="handleReset">
              重置
            </button>
            <div class="ml-auto flex items-center gap-2">
              <span class="text-xs text-text-muted">速度：</span>
              <button
                v-for="s in speeds"
                :key="s"
                class="text-xs px-2 py-1 rounded transition-all"
                :class="speed === s ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/40' : 'text-text-muted border border-border-subtle hover:border-border-hover'"
                @click="speed = s"
              >{{ s }}x</button>
            </div>
          </div>

          <!-- Step Indicator -->
          <StepIndicator :steps="activeSteps" :current-index="currentStepIndex" @goto="gotoStep" />
        </div>
      </div>

      <!-- Right: Info Panel -->
      <div class="space-y-4">
        <!-- Step Detail -->
        <div class="glass-card p-4 fade-up stagger-3">
          <div class="flex items-center gap-2 mb-3">
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              :class="currentStep ? (currentStep.cacheHit ? 'bg-accent-success/20 text-accent-success border border-accent-success/40' : 'bg-accent-primary/20 text-accent-primary border border-accent-primary/40') : 'bg-white/5 text-text-muted border border-border-subtle'"
            >{{ currentStepIndex + 1 }}</span>
            <span class="font-semibold text-sm">{{ currentStep?.title || '准备就绪' }}</span>
            <span v-if="currentStep?.cacheHit" class="text-[10px] px-2 py-0.5 rounded bg-accent-success/20 text-accent-success">缓存命中</span>
          </div>
          <p class="text-text-secondary text-sm leading-relaxed mb-3">
            {{ currentStep?.description || '点击"开始"按钮，逐步观察DNS解析的每一个步骤。' }}
          </p>
          <div v-if="currentStep" class="text-xs font-medium" :class="currentStep.cacheHit ? 'text-accent-success' : 'text-accent-primary'">
            {{ currentStep.message }}
          </div>
        </div>

        <!-- Packet Info -->
        <div v-if="currentStep && currentStep.direction !== 'none'" class="glass-card p-4 fade-up stagger-4">
          <h3 class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">报文信息</h3>
          <table class="table-glass">
            <tbody>
              <tr>
                <td class="text-text-muted">协议</td>
                <td>
                  <span class="px-2 py-0.5 rounded text-xs font-semibold"
                    :style="{ background: currentStep.packetColor + '20', color: currentStep.packetColor }">
                    {{ currentStep.protocol }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="text-text-muted">类型</td>
                <td>
                  <span v-if="currentStep.direction === 'left'" class="text-accent-success text-xs">Response ↓</span>
                  <span v-else class="text-accent-primary text-xs">Query ↑</span>
                </td>
              </tr>
              <tr>
                <td class="text-text-muted">源IP</td>
                <td class="text-accent-primary">{{ currentStep.srcIP }}</td>
              </tr>
              <tr>
                <td class="text-text-muted">目的IP</td>
                <td class="text-accent-secondary">{{ currentStep.dstIP }}</td>
              </tr>
              <tr>
                <td class="text-text-muted">源MAC</td>
                <td class="text-accent-warning">{{ currentStep.srcMAC }}</td>
              </tr>
              <tr>
                <td class="text-text-muted">目的MAC</td>
                <td :class="currentStep.dstMAC === 'ff:ff:ff:ff:ff:ff' ? 'text-accent-warning' : 'text-text-secondary'">
                  {{ currentStep.dstMAC }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- DNS Cache Table with Before/After -->
        <div class="glass-card p-4 fade-up stagger-5">
          <h3 class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">DNS缓存表</h3>

          <!-- Cache state: Before → After -->
          <div v-if="currentStep && currentStep.dnsCacheBefore?.length > 0" class="mb-2">
            <div class="text-[10px] text-text-muted mb-1">更新前：</div>
            <table class="table-glass mb-2 opacity-60">
              <thead>
                <tr><th>域名</th><th>IP</th><th>TTL</th></tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in currentStep.dnsCacheBefore" :key="'b'+idx">
                  <td class="text-accent-primary text-xs">{{ item.domain }}</td>
                  <td class="text-text-secondary text-xs">{{ item.ip }}</td>
                  <td class="text-text-muted text-xs">{{ item.ttl }}s</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center text-[10px] text-accent-primary mb-2">↓ 更新后</div>
          </div>

          <table class="table-glass">
            <thead>
              <tr>
                <th>域名</th>
                <th>IP地址</th>
                <th>TTL</th>
                <th>来源</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="dnsCache.length === 0">
                <td colspan="4" class="text-center text-text-muted py-3">暂无缓存数据</td>
              </tr>
              <tr v-for="(item, idx) in dnsCache" :key="idx" :class="{ 'bg-accent-success/10': item.fresh }">
                <td class="text-accent-primary">{{ item.domain }}</td>
                <td class="text-text-secondary">{{ item.ip }}</td>
                <td class="text-text-muted">{{ item.ttl }}s</td>
                <td class="text-text-muted text-xs">{{ item.source }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TopoCanvas from '@/components/TopoCanvas.vue'
import StepIndicator from '@/components/StepIndicator.vue'
import { dnsStepsMiss, dnsStepsHit, dnsNodes, dnsConnections } from '@/data/dns.js'

const domainInput = ref('www.lessybest.com')
const cacheMode = ref('miss') // 'miss' or 'hit'
const currentStepIndex = ref(-1)
const isPlaying = ref(false)
const speed = ref(1)
const speeds = [0.5, 1, 2]
const dnsCache = ref([])

// Active steps based on cache mode
const activeSteps = computed(() => {
  return cacheMode.value === 'hit' ? dnsStepsHit : dnsStepsMiss
})

const currentStep = computed(() => {
  if (currentStepIndex.value < 0) return null
  return activeSteps.value[currentStepIndex.value] || null
})

const syncDnsCache = () => {
  if (!currentStep.value) return
  dnsCache.value = currentStep.value.dnsCacheAfter || []
}

const switchCacheMode = (mode) => {
  cacheMode.value = mode
  handleReset()
}

const gotoStep = (idx) => {
  isPlaying.value = false
  currentStepIndex.value = idx
  syncDnsCache()
}

const handleStart = () => {
  // Validate domain input (basic check, don't block animation on failure)
  const domain = domainInput.value.trim()
  if (!domain) {
    domainInput.value = 'www.lessybest.com'
  }

  handleReset()
  isPlaying.value = true
  currentStepIndex.value = 0
  syncDnsCache()
  autoPlay()
}

const autoPlay = () => {
  if (!isPlaying.value || currentStepIndex.value >= activeSteps.value.length - 1) {
    isPlaying.value = false
    return
  }
  setTimeout(() => {
    if (!isPlaying.value) return
    currentStepIndex.value++
    syncDnsCache()
    autoPlay()
  }, 2000 / speed.value)
}

const handleNext = () => {
  isPlaying.value = false
  if (currentStepIndex.value < activeSteps.value.length - 1) {
    currentStepIndex.value++
    syncDnsCache()
  }
}

const handlePrev = () => {
  isPlaying.value = false
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    syncDnsCache()
  }
}

const handleReset = () => {
  isPlaying.value = false
  currentStepIndex.value = -1
  dnsCache.value = []
}
</script>
