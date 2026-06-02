<template>
  <div class="min-h-screen px-4 md:px-8 pb-16 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="pt-8 pb-6 fade-up">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg bg-accent-warning/20 border border-accent-warning/40 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="6" width="14" height="4" rx="1.5" stroke="#f59e0b" stroke-width="1.5"/>
            <path d="M5 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#f59e0b" stroke-width="1.5"/>
            <path d="M5 10v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2" stroke="#f59e0b" stroke-width="1.5"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold">ARP地址解析</h1>
      </div>
      <p class="text-text-secondary text-sm">
        展示ARP Request广播与ARP Reply单播的完整过程，动态呈现ARP缓存表写入与交换机MAC地址表的学习更新机制。
      </p>
    </div>

    <!-- Target IP Input -->
    <div class="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center fade-up stagger-1">
      <label class="text-sm text-text-muted shrink-0">已知目标IP地址：</label>
      <input
        v-model="targetIP"
        type="text"
        class="flex-1 bg-white/5 border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-warning transition-colors font-mono"
        placeholder="例如：192.168.1.200"
        @keyup.enter="handleStart"
      />
      <button class="btn-primary text-sm shrink-0 bg-accent-warning/90 hover:bg-accent-warning" @click="handleStart" :disabled="isPlaying">
        发起ARP请求
      </button>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Topology + Controls -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Topology -->
        <div class="glass-card p-4 fade-up stagger-2">
          <TopoCanvas
            :nodes="arpNodes"
            :connections="arpConnections"
            :current-step="currentStep"
          />
        </div>

        <!-- Controls -->
        <div class="glass-card p-4 fade-up stagger-3">
          <div class="flex flex-wrap gap-2 items-center mb-4">
            <button class="btn-primary text-sm bg-accent-warning/90 hover:bg-accent-warning" @click="handleStart" :disabled="isPlaying">
              开始
            </button>
            <button class="btn-secondary text-sm" @click="handleNext" :disabled="isPlaying || currentStepIndex >= arpSteps.length - 1">
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
                :class="speed === s ? 'bg-accent-warning/20 text-accent-warning border border-accent-warning/40' : 'text-text-muted border border-border-subtle hover:border-border-hover'"
                @click="speed = s"
              >{{ s }}x</button>
            </div>
          </div>
          <StepIndicator :steps="arpSteps" :current-index="currentStepIndex" @goto="gotoStep" />
        </div>
      </div>

      <!-- Right: Info Panel -->
      <div class="space-y-4">
        <!-- Step Detail -->
        <div class="glass-card p-4 fade-up stagger-3">
          <div class="flex items-center gap-2 mb-3">
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              :class="currentStep ? (currentStep.isSummary ? 'bg-accent-success/20 text-accent-success border border-accent-success/40' : 'bg-accent-warning/20 text-accent-warning border border-accent-warning/40') : 'bg-white/5 text-text-muted border border-border-subtle'"
            >{{ currentStepIndex + 1 }}</span>
            <span class="font-semibold text-sm">{{ currentStep?.title || '准备就绪' }}</span>
            <span v-if="currentStep?.isSummary" class="text-[10px] px-2 py-0.5 rounded bg-accent-success/20 text-accent-success">结果汇总</span>
          </div>
          <p class="text-text-secondary text-sm leading-relaxed mb-3">
            {{ currentStep?.description || '点击"开始"按钮，逐步观察ARP解析的每一个步骤。' }}
          </p>
          <div v-if="currentStep" class="text-xs" :class="currentStep.isSummary ? 'text-accent-success' : (currentStep.broadcast ? 'text-accent-warning' : 'text-accent-success')">
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
                <td class="text-text-muted">广播</td>
                <td>
                  <span v-if="currentStep.broadcast" class="text-accent-warning text-xs">是 (ff:ff:ff:ff:ff:ff)</span>
                  <span v-else class="text-accent-success text-xs">否 (单播)</span>
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
                <td :class="currentStep.dstMAC === 'ff:ff:ff:ff:ff:ff' ? 'text-accent-warning font-semibold' : 'text-text-secondary'">
                  {{ currentStep.dstMAC }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ARP Table with Before/After -->
        <div class="glass-card p-4 fade-up stagger-4">
          <h3 class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="3" width="11" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <path d="M3 3V2a1.5 1.5 0 0 1 3-1.5h0a1.5 1.5 0 0 1 3 1.5v1" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            ARP缓存表
          </h3>

          <!-- Show before state if different from after -->
          <div v-if="currentStep && currentStep.arpTableBefore?.length > 0 && arpTableBefore.length > 0" class="mb-2">
            <div class="text-[10px] text-text-muted mb-1">更新前：</div>
            <table class="table-glass mb-2 opacity-60">
              <thead><tr><th>IP</th><th>MAC</th><th>类型</th><th>TTL</th></tr></thead>
              <tbody>
                <tr v-for="(item, idx) in arpTableBefore" :key="'b'+idx">
                  <td class="text-accent-primary text-xs">{{ item.ip }}</td>
                  <td class="text-text-secondary text-xs" :class="item.mac === '未知' ? 'text-accent-warning' : ''">{{ item.mac }}</td>
                  <td><span class="px-1 py-0.5 rounded text-[10px]" :class="item.type === '待解析' ? 'bg-accent-warning/15 text-accent-warning' : 'bg-white/5 text-text-muted'">{{ item.type }}</span></td>
                  <td class="text-text-muted text-xs">{{ item.ttl }}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center text-[10px] text-accent-warning mb-2">↓ 更新后</div>
          </div>

          <table class="table-glass">
            <thead>
              <tr>
                <th>IP地址</th>
                <th>MAC地址</th>
                <th>类型</th>
                <th>TTL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="arpTable.length === 0">
                <td colspan="4" class="text-center text-text-muted py-3 border-dashed border border-border-subtle rounded">暂无数据</td>
              </tr>
              <tr v-for="(item, idx) in arpTable" :key="idx" :class="{ 'bg-accent-success/10': item.new, 'bg-accent-warning/5': item.type === '待解析' }">
                <td class="text-accent-primary">{{ item.ip }}</td>
                <td :class="item.mac === '未知' ? 'text-accent-warning' : 'text-text-secondary'">{{ item.mac }}</td>
                <td>
                  <span class="px-1.5 py-0.5 rounded text-[10px]" :class="item.type === '动态' ? 'bg-accent-success/15 text-accent-success' : item.type === '待解析' ? 'bg-accent-warning/15 text-accent-warning' : 'bg-white/5 text-text-muted'">
                    {{ item.type }}
                  </span>
                </td>
                <td class="text-text-muted text-xs">{{ item.ttl }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MAC Table with Before/After -->
        <div class="glass-card p-4 fade-up stagger-5">
          <h3 class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="3.5" width="11" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="3.5" cy="6" r="0.8" fill="currentColor"/>
              <circle cx="6" cy="6" r="0.8" fill="currentColor"/>
              <circle cx="8.5" cy="6" r="0.8" fill="currentColor"/>
            </svg>
            交换机MAC地址表
          </h3>

          <!-- Show before state if different -->
          <div v-if="currentStep && currentStep.macTableBefore?.length > 0 && macTableBefore.length > 0" class="mb-2">
            <div class="text-[10px] text-text-muted mb-1">更新前：</div>
            <table class="table-glass mb-2 opacity-60">
              <thead><tr><th>MAC</th><th>端口</th><th>类型</th></tr></thead>
              <tbody>
                <tr v-for="(item, idx) in macTableBefore" :key="'b'+idx">
                  <td class="text-text-secondary text-[11px]">{{ item.mac }}</td>
                  <td class="text-accent-primary text-xs">{{ item.port }}</td>
                  <td class="text-text-muted text-xs">{{ item.type }}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center text-[10px] text-accent-primary mb-2">↓ 更新后</div>
          </div>

          <table class="table-glass">
            <thead>
              <tr>
                <th>MAC地址</th>
                <th>端口</th>
                <th>类型</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="macTable.length === 0">
                <td colspan="3" class="text-center text-text-muted py-3 border-dashed border border-border-subtle rounded">暂无数据</td>
              </tr>
              <tr v-for="(item, idx) in macTable" :key="idx" :class="{ 'bg-accent-secondary/10': item.new }">
                <td class="text-text-secondary text-[11px]">{{ item.mac }}</td>
                <td class="text-accent-primary">{{ item.port }}</td>
                <td>
                  <span class="px-1.5 py-0.5 rounded text-[10px]" :class="item.new ? 'bg-accent-secondary/15 text-accent-secondary' : 'bg-white/5 text-text-muted'">
                    {{ item.type }}
                  </span>
                </td>
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
import { arpSteps, arpNodes, arpConnections } from '@/data/arp.js'

const targetIP = ref('192.168.1.200')
const currentStepIndex = ref(-1)
const isPlaying = ref(false)
const speed = ref(1)
const speeds = [0.5, 1, 2]
const arpTable = ref([])
const arpTableBefore = ref([])
const macTable = ref([])
const macTableBefore = ref([])

const currentStep = computed(() => {
  if (currentStepIndex.value < 0) return null
  return arpSteps[currentStepIndex.value] || null
})

const syncTables = () => {
  if (!currentStep.value) return
  arpTable.value = currentStep.value.arpTableAfter || []
  arpTableBefore.value = currentStep.value.arpTableBefore || []
  macTable.value = currentStep.value.macTableAfter || []
  macTableBefore.value = currentStep.value.macTableBefore || []
}

const gotoStep = (idx) => {
  isPlaying.value = false
  currentStepIndex.value = idx
  syncTables()
}

const handleStart = () => {
  const ip = targetIP.value.trim()
  if (!ip) {
    targetIP.value = '192.168.1.200'
  }
  handleReset()
  isPlaying.value = true
  currentStepIndex.value = 0
  syncTables()
  autoPlay()
}

const autoPlay = () => {
  if (!isPlaying.value || currentStepIndex.value >= arpSteps.length - 1) {
    isPlaying.value = false
    return
  }
  setTimeout(() => {
    if (!isPlaying.value) return
    currentStepIndex.value++
    syncTables()
    autoPlay()
  }, 2000 / speed.value)
}

const handleNext = () => {
  isPlaying.value = false
  if (currentStepIndex.value < arpSteps.length - 1) {
    currentStepIndex.value++
    syncTables()
  }
}

const handlePrev = () => {
  isPlaying.value = false
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    syncTables()
  }
}

const handleReset = () => {
  isPlaying.value = false
  currentStepIndex.value = -1
  arpTable.value = []
  arpTableBefore.value = []
  macTable.value = []
  macTableBefore.value = []
}
</script>
