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
        展示ARP Request广播与ARP Reply单播的完整过程，支持同网段和跨网段两种通信场景。
      </p>
    </div>

    <!-- Mode Selector -->
    <div class="glass-card p-4 mb-6 fade-up stagger-1">
      <div class="flex items-center gap-4 mb-4">
        <span class="text-sm text-text-muted shrink-0">选择演示模式：</span>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="currentMode === 'same-network'
              ? 'bg-accent-warning/20 text-accent-warning border border-accent-warning/40'
              : 'bg-white/5 text-text-muted border border-border-subtle hover:border-border-hover'"
            @click="switchMode('same-network')"
          >
            同网段通信
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="currentMode === 'cross-network'
              ? 'bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/40'
              : 'bg-white/5 text-text-muted border border-border-subtle hover:border-border-hover'"
            @click="switchMode('cross-network')"
          >
            跨网段通信
          </button>
        </div>
      </div>
      <div class="text-xs text-text-muted">
        <span v-if="currentMode === 'same-network'">📍 场景：PC1 (192.168.1.100) → PC2 (192.168.1.101)，同一网段内ARP解析</span>
        <span v-else>🌐 场景：PC1 (192.168.1.100) → PC4 (192.168.2.101)，跨网段通信需经过路由器</span>
      </div>
    </div>

    <!-- Network Topology Legend -->
    <div class="glass-card p-3 mb-4 flex flex-wrap gap-4 text-xs fade-up stagger-2">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full bg-accent-primary"></div>
        <span class="text-text-muted">网段1 (192.168.1.0/24)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full bg-accent-secondary"></div>
        <span class="text-text-muted">网段2 (192.168.2.0/24)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full bg-accent-warning"></div>
        <span class="text-text-muted">路由器</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full bg-accent-success"></div>
        <span class="text-text-muted">单播</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full bg-accent-primary" style="opacity: 0.5"></div>
        <span class="text-text-muted">广播</span>
      </div>
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
            <button class="btn-secondary text-sm" @click="handleNext" :disabled="isPlaying || currentStepIndex >= currentSteps.length - 1">
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
          <StepIndicator :steps="currentSteps" :current-index="currentStepIndex" @goto="gotoStep" />
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
          <div v-if="currentStep" class="text-xs p-2 rounded-lg" :class="currentStep.isSummary ? 'bg-accent-success/10 text-accent-success' : (currentStep.broadcast ? 'bg-accent-warning/10 text-accent-warning' : 'bg-accent-success/10 text-accent-success')">
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

        <!-- PC1 ARP Table -->
        <div class="glass-card p-4 fade-up stagger-4">
          <h3 class="text-xs font-semibold text-accent-primary uppercase tracking-widest mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-accent-primary"></span>
            PC1 ARP缓存表
          </h3>

          <div v-if="currentStep && currentStep.pc1ArpBefore?.length > 0 && currentStep.pc1ArpBefore.length > 0 && JSON.stringify(currentStep.pc1ArpBefore) !== JSON.stringify(currentStep.pc1ArpAfter)" class="mb-2">
            <div class="text-[10px] text-text-muted mb-1">更新前：</div>
            <table class="table-glass mb-2 opacity-60">
              <thead><tr><th>IP</th><th>MAC</th><th>类型</th></tr></thead>
              <tbody>
                <tr v-for="(item, idx) in currentStep.pc1ArpBefore" :key="'b'+idx">
                  <td class="text-accent-primary text-xs">{{ item.ip }}</td>
                  <td class="text-text-secondary text-xs" :class="item.mac === '未知' ? 'text-accent-warning' : ''">{{ item.mac }}</td>
                  <td><span class="px-1 py-0.5 rounded text-[10px]" :class="item.type === '待解析' ? 'bg-accent-warning/15 text-accent-warning' : 'bg-white/5 text-text-muted'">{{ item.type }}</span></td>
                </tr>
              </tbody>
            </table>
            <div class="text-center text-[10px] text-accent-success mb-2">↓ 更新后</div>
          </div>

          <table class="table-glass">
            <thead>
              <tr>
                <th>IP地址</th>
                <th>MAC地址</th>
                <th>类型</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!currentStep || currentStep.pc1ArpAfter.length === 0">
                <td colspan="3" class="text-center text-text-muted py-3 border-dashed border border-border-subtle rounded">暂无数据</td>
              </tr>
              <tr v-for="(item, idx) in (currentStep?.pc1ArpAfter || [])" :key="idx" :class="{ 'bg-accent-success/10': item.new, 'bg-accent-warning/5': item.type === '待解析' }">
                <td class="text-accent-primary text-xs">{{ item.ip }}</td>
                <td :class="item.mac === '未知' ? 'text-accent-warning' : 'text-text-secondary text-xs'">{{ item.mac }}</td>
                <td>
                  <span class="px-1.5 py-0.5 rounded text-[10px]" :class="item.type === '动态' ? 'bg-accent-success/15 text-accent-success' : item.type === '待解析' ? 'bg-accent-warning/15 text-accent-warning' : 'bg-white/5 text-text-muted'">
                    {{ item.type }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Router ARP Table (Cross-network mode) -->
        <div v-if="currentMode === 'cross-network'" class="glass-card p-4 fade-up stagger-4">
          <h3 class="text-xs font-semibold text-accent-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-accent-warning"></span>
            路由器R1 ARP缓存表
          </h3>

          <div v-if="currentStep && currentStep.routerArpBefore?.length > 0 && JSON.stringify(currentStep.routerArpBefore) !== JSON.stringify(currentStep.routerArpAfter)" class="mb-2">
            <div class="text-[10px] text-text-muted mb-1">更新前：</div>
            <table class="table-glass mb-2 opacity-60">
              <thead><tr><th>IP</th><th>MAC</th><th>类型</th></tr></thead>
              <tbody>
                <tr v-for="(item, idx) in currentStep.routerArpBefore" :key="'b'+idx">
                  <td class="text-accent-secondary text-xs">{{ item.ip }}</td>
                  <td class="text-text-secondary text-xs" :class="item.mac === '未知' ? 'text-accent-warning' : ''">{{ item.mac }}</td>
                  <td><span class="px-1 py-0.5 rounded text-[10px]" :class="item.type === '待解析' ? 'bg-accent-warning/15 text-accent-warning' : 'bg-white/5 text-text-muted'">{{ item.type }}</span></td>
                </tr>
              </tbody>
            </table>
            <div class="text-center text-[10px] text-accent-success mb-2">↓ 更新后</div>
          </div>

          <table class="table-glass">
            <thead>
              <tr>
                <th>IP地址</th>
                <th>MAC地址</th>
                <th>类型</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!currentStep || currentStep.routerArpAfter.length === 0">
                <td colspan="3" class="text-center text-text-muted py-3 border-dashed border border-border-subtle rounded">暂无数据</td>
              </tr>
              <tr v-for="(item, idx) in (currentStep?.routerArpAfter || [])" :key="idx" :class="{ 'bg-accent-success/10': item.new, 'bg-accent-warning/5': item.type === '待解析' }">
                <td class="text-accent-secondary text-xs">{{ item.ip }}</td>
                <td :class="item.mac === '未知' ? 'text-accent-warning' : 'text-text-secondary text-xs'">{{ item.mac }}</td>
                <td>
                  <span class="px-1.5 py-0.5 rounded text-[10px]" :class="item.type === '动态' ? 'bg-accent-success/15 text-accent-success' : item.type === '待解析' ? 'bg-accent-warning/15 text-accent-warning' : 'bg-white/5 text-text-muted'">
                    {{ item.type }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SW1 MAC Table -->
        <div class="glass-card p-4 fade-up stagger-5">
          <h3 class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="3" width="11" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <path d="M3 3V2a1.5 1.5 0 0 1 3-1.5h0a1.5 1.5 0 0 1 3 1.5v1" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            SW1 MAC地址表
          </h3>

          <div v-if="currentStep && currentStep.sw1MacBefore?.length > 0 && JSON.stringify(currentStep.sw1MacBefore) !== JSON.stringify(currentStep.sw1MacAfter)" class="mb-2">
            <div class="text-[10px] text-text-muted mb-1">更新前：</div>
            <table class="table-glass mb-2 opacity-60">
              <thead><tr><th>MAC</th><th>端口</th><th>类型</th></tr></thead>
              <tbody>
                <tr v-for="(item, idx) in currentStep.sw1MacBefore" :key="'b'+idx">
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
              <tr v-if="!currentStep || currentStep.sw1MacAfter.length === 0">
                <td colspan="3" class="text-center text-text-muted py-3 border-dashed border border-border-subtle rounded">暂无数据</td>
              </tr>
              <tr v-for="(item, idx) in (currentStep?.sw1MacAfter || [])" :key="idx" :class="{ 'bg-accent-primary/10': item.new }">
                <td class="text-text-secondary text-[11px]">{{ item.mac }}</td>
                <td class="text-accent-primary">{{ item.port }}</td>
                <td>
                  <span class="px-1.5 py-0.5 rounded text-[10px]" :class="item.new ? 'bg-accent-primary/15 text-accent-primary' : 'bg-white/5 text-text-muted'">
                    {{ item.type }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SW2 MAC Table (Cross-network mode) -->
        <div v-if="currentMode === 'cross-network'" class="glass-card p-4 fade-up stagger-5">
          <h3 class="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="3" width="11" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <path d="M3 3V2a1.5 1.5 0 0 1 3-1.5h0a1.5 1.5 0 0 1 3 1.5v1" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            SW2 MAC地址表
          </h3>

          <div v-if="currentStep && currentStep.sw2MacBefore?.length > 0 && JSON.stringify(currentStep.sw2MacBefore) !== JSON.stringify(currentStep.sw2MacAfter)" class="mb-2">
            <div class="text-[10px] text-text-muted mb-1">更新前：</div>
            <table class="table-glass mb-2 opacity-60">
              <thead><tr><th>MAC</th><th>端口</th><th>类型</th></tr></thead>
              <tbody>
                <tr v-for="(item, idx) in currentStep.sw2MacBefore" :key="'b'+idx">
                  <td class="text-text-secondary text-[11px]">{{ item.mac }}</td>
                  <td class="text-accent-secondary text-xs">{{ item.port }}</td>
                  <td class="text-text-muted text-xs">{{ item.type }}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center text-[10px] text-accent-secondary mb-2">↓ 更新后</div>
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
              <tr v-if="!currentStep || currentStep.sw2MacAfter.length === 0">
                <td colspan="3" class="text-center text-text-muted py-3 border-dashed border border-border-subtle rounded">暂无数据</td>
              </tr>
              <tr v-for="(item, idx) in (currentStep?.sw2MacAfter || [])" :key="idx" :class="{ 'bg-accent-secondary/10': item.new }">
                <td class="text-text-secondary text-[11px]">{{ item.mac }}</td>
                <td class="text-accent-secondary">{{ item.port }}</td>
                <td>
                  <span class="px-1.5 py-0.5 rounded text-[10px]" :class="item.new ? 'bg-accent-secondary/15 text-accent-secondary' : 'bg-white/5 text-text-muted'">
                    {{ item.type }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Panel (Results only shown at end) -->
        <div v-if="currentStep?.isSummary" class="glass-card p-4 fade-up stagger-6 border border-accent-success/30">
          <h3 class="text-sm font-semibold text-accent-success mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            通信结果汇总
          </h3>

          <div v-if="currentMode === 'same-network'" class="space-y-3">
            <div class="p-3 rounded-lg bg-accent-success/10 border border-accent-success/20">
              <div class="text-xs font-semibold text-accent-success mb-2">同网段通信：PC1 → PC2</div>
              <div class="text-xs text-text-secondary space-y-1">
                <div>• ARP一次完成（广播Request → 单播Reply）</div>
                <div>• 后续通信直接使用ARP缓存，无需再发ARP</div>
              </div>
            </div>
            <div class="p-3 rounded-lg bg-white/5">
              <div class="text-xs font-semibold text-text-muted mb-2">流程图</div>
              <div class="flex items-center justify-center gap-1 text-[10px] text-text-secondary flex-wrap">
                <span class="px-2 py-1 rounded bg-accent-primary/20 text-accent-primary">PC1</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-accent-warning/20 text-accent-warning">ARP网关</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-accent-success/20 text-accent-success">PC2</span>
              </div>
            </div>
          </div>

          <div v-else class="space-y-3">
            <div class="p-3 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20">
              <div class="text-xs font-semibold text-accent-secondary mb-2">跨网段通信：PC1 → PC4</div>
              <div class="text-xs text-text-secondary space-y-1">
                <div>• <strong class="text-accent-warning">ARP不能跨路由器广播！</strong></div>
                <div>• PC1需先获取网关MAC（ARP Request → Reply）</div>
                <div>• 路由器查路由表，确定转发路径</div>
                <div>• 路由器在目标网段发起ARP请求（获取PC4的MAC）</div>
                <div>• 路由器将数据包转发给PC4</div>
              </div>
            </div>
            <div class="p-3 rounded-lg bg-white/5">
              <div class="text-xs font-semibold text-text-muted mb-2">流程图</div>
              <div class="flex items-center justify-center gap-1 text-[10px] text-text-secondary flex-wrap">
                <span class="px-2 py-1 rounded bg-accent-primary/20 text-accent-primary">PC1</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-accent-warning/20 text-accent-warning">ARP网关</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-accent-secondary/20 text-accent-secondary">Router</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-accent-warning/20 text-accent-warning">ARP目标</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-accent-success/20 text-accent-success">PC4</span>
              </div>
            </div>
            <div class="p-3 rounded-lg bg-accent-warning/10 border border-accent-warning/20">
              <div class="text-xs text-accent-warning font-medium">⚠️ 关键结论</div>
              <div class="text-xs text-text-secondary mt-1">ARP广播只能在同一广播域（网段）内传播，跨网段通信必须依赖路由器作为中转，路由器需要分别在各网段进行ARP解析。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TopoCanvas from '@/components/TopoCanvas.vue'
import StepIndicator from '@/components/StepIndicator.vue'
import { arpNodes, arpConnections, arpSameNetworkSteps, arpCrossNetworkSteps } from '@/data/arp.js'

const currentMode = ref('same-network')
const currentStepIndex = ref(-1)
const isPlaying = ref(false)
const speed = ref(1)
const speeds = [0.5, 1, 2]

const currentSteps = computed(() => {
  return currentMode.value === 'same-network' ? arpSameNetworkSteps : arpCrossNetworkSteps
})

const currentStep = computed(() => {
  if (currentStepIndex.value < 0) return null
  return currentSteps.value[currentStepIndex.value] || null
})

const switchMode = (mode) => {
  currentMode.value = mode
  handleReset()
}

const gotoStep = (idx) => {
  isPlaying.value = false
  currentStepIndex.value = idx
}

const handleStart = () => {
  handleReset()
  isPlaying.value = true
  currentStepIndex.value = 0
  autoPlay()
}

const autoPlay = () => {
  if (!isPlaying.value || currentStepIndex.value >= currentSteps.value.length - 1) {
    isPlaying.value = false
    return
  }
  setTimeout(() => {
    if (!isPlaying.value) return
    currentStepIndex.value++
    autoPlay()
  }, 2000 / speed.value)
}

const handleNext = () => {
  isPlaying.value = false
  if (currentStepIndex.value < currentSteps.value.length - 1) {
    currentStepIndex.value++
  }
}

const handlePrev = () => {
  isPlaying.value = false
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const handleReset = () => {
  isPlaying.value = false
  currentStepIndex.value = -1
}
</script>
