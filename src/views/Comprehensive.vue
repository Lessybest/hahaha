<template>
  <div class="min-h-screen px-4 md:px-8 pb-16 max-w-6xl mx-auto">
    <div class="pt-8 pb-6 fade-up">
      <h1 class="text-2xl font-bold mb-2">综合网络场景模拟</h1>
      <p class="text-text-secondary text-sm">
        H1（192.168.1.100）访问 www.lessybest.com 的完整通信过程 — 从 ARP → DNS → TCP → HTTP 全链路可视化
      </p>
    </div>

    <!-- 网络拓扑 -->
    <div class="glass-card p-6 mb-6 fade-up stagger-1">
      <h3 class="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">网络拓扑</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <div v-for="node in topoNodes" :key="node.id"
          class="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-subtle bg-white/5 text-center"
          :class="isNodeHighlighted(node.id) ? 'ring-2 ring-accent-primary/60 bg-accent-primary/10' : ''"
        >
          <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
            :style="{ borderColor: node.color, color: node.color }">
            {{ node.shortLabel }}
          </div>
          <span class="text-xs font-medium text-text-primary">{{ node.label }}</span>
          <span class="text-[10px] text-text-muted font-mono">{{ node.ip }}</span>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="glass-card p-4 mb-6 fade-up stagger-2">
      <div class="flex flex-wrap gap-2 items-center mb-4">
        <button class="btn-primary text-sm" @click="handleStart" :disabled="playing">
          <span class="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5V2z"/></svg>
            开始演示
          </span>
        </button>
        <button class="btn-secondary text-sm" @click="handleNext" :disabled="playing || stepIndex >= steps.length - 1">下一步</button>
        <button class="btn-secondary text-sm" @click="handlePrev" :disabled="playing || stepIndex <= 0">上一步</button>
        <button class="btn-ghost text-sm" @click="handleReset">重置</button>
        <div class="ml-auto flex items-center gap-2 text-xs text-text-muted">
          <span>速度：</span>
          <button v-for="s in speedOptions" :key="s.value"
            class="px-2 py-1 rounded"
            :class="speed === s.value ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/10'"
            @click="speed = s.value"
          >{{ s.label }}</button>
        </div>
      </div>
      <StepIndicator :steps="steps" :current-index="stepIndex" />
    </div>

    <!-- 当前步骤详情 -->
    <div v-if="currentStep" class="glass-card p-5 mb-6 fade-up stagger-3">
      <h3 class="text-sm font-semibold text-text-primary mb-2">
        {{ currentStep.title }}
      </h3>
      <p class="text-xs text-text-secondary leading-relaxed mb-3">{{ currentStep.description }}</p>
      <div class="flex items-center gap-2">
        <span class="text-xs px-2 py-1 rounded" :style="{ background: currentStep.protocolColor + '20', color: currentStep.protocolColor }">
          {{ currentStep.protocol }}
        </span>
        <span v-if="currentStep.broadcast" class="text-xs px-2 py-1 rounded bg-accent-warning/20 text-accent-warning">
          广播
        </span>
        <span v-else class="text-xs px-2 py-1 rounded bg-accent-success/20 text-accent-success">
          单播
        </span>
      </div>
    </div>

    <!-- 报文详情 -->
    <div v-if="currentStep && currentStep.packetDetail" class="glass-card p-5 mb-6 fade-up stagger-3">
      <h3 class="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
        {{ currentStep.protocol }} 报文详情
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div v-for="(val, key) in currentStep.packetDetail" :key="key"
          class="flex gap-2 p-2 rounded-lg bg-white/5 border border-border-subtle"
        >
          <span class="text-text-muted shrink-0 w-28">{{ key }}：</span>
          <span class="text-text-primary font-mono break-all">{{ val }}</span>
        </div>
      </div>
    </div>

    <!-- 协议栈封装过程 -->
    <div v-if="currentStep && currentStep.protocolStack" class="glass-card p-5 mb-6 fade-up stagger-4">
      <h3 class="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">协议栈封装过程</h3>
      <div class="space-y-1">
        <div v-for="(layer, idx) in currentStep.protocolStack" :key="idx"
          class="flex items-center gap-3 p-2 rounded-lg"
          :style="{ backgroundColor: layer.color + '15' }"
        >
          <div class="w-24 text-xs font-semibold uppercase tracking-wider" :style="{ color: layer.color }">
            {{ layer.layer }}
          </div>
          <div class="text-xs text-text-primary font-mono flex-1">{{ layer.content }}</div>
        </div>
      </div>
    </div>

    <!-- 三张表 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="glass-card p-4 fade-up stagger-5">
        <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">ARP 缓存表（H1）</h4>
        <div v-if="currentArpTable.length === 0" class="text-xs text-text-muted italic">（空）</div>
        <table v-else class="w-full text-xs">
          <thead><tr class="text-text-muted"><th class="text-left">IP</th><th class="text-left">MAC</th><th class="text-left">TTL</th></tr></thead>
          <tbody>
            <tr v-for="(entry, i) in currentArpTable" :key="i" :class="entry.new ? 'text-accent-primary font-bold' : ''">
              <td class="py-0.5 font-mono">{{ entry.ip }}</td>
              <td class="py-0.5 font-mono text-[10px]">{{ entry.mac }}</td>
              <td class="py-0.5">{{ entry.ttl }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="glass-card p-4 fade-up stagger-6">
        <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">交换机 MAC 地址表</h4>
        <div v-if="currentMacTable.length === 0" class="text-xs text-text-muted italic">（空）</div>
        <table v-else class="w-full text-xs">
          <thead><tr class="text-text-muted"><th class="text-left">MAC</th><th class="text-left">端口</th><th class="text-left">年龄</th></tr></thead>
          <tbody>
            <tr v-for="(entry, i) in currentMacTable" :key="i" :class="entry.new ? 'text-accent-primary font-bold' : ''">
              <td class="py-0.5 font-mono text-[10px]">{{ entry.mac }}</td>
              <td class="py-0.5">{{ entry.port }}</td>
              <td class="py-0.5">{{ entry.age }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="glass-card p-4 fade-up stagger-7">
        <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">DNS 缓存（H1）</h4>
        <div v-if="currentDnsCache.length === 0" class="text-xs text-text-muted italic">（空）</div>
        <table v-else class="w-full text-xs">
          <thead><tr class="text-text-muted"><th class="text-left">域名</th><th class="text-left">IP</th><th class="text-left">TTL</th></tr></thead>
          <tbody>
            <tr v-for="(entry, i) in currentDnsCache" :key="i" :class="entry.new ? 'text-accent-primary font-bold' : ''">
              <td class="py-0.5 font-mono">{{ entry.domain }}</td>
              <td class="py-0.5 font-mono">{{ entry.ip }}</td>
              <td class="py-0.5">{{ entry.ttl }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TCP 状态 -->
    <div v-if="currentStep && currentStep.tcpState" class="glass-card p-4 mb-6 fade-up stagger-8">
      <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">TCP 连接状态</h4>
      <div class="text-sm font-mono" :class="currentStep.tcpState === 'ESTABLISHED' ? 'text-accent-success' : 'text-text-secondary'">
        {{ currentStep.tcpState }}
      </div>
    </div>

    <!-- 通信日志 -->
    <div class="glass-card p-4 fade-up stagger-8">
      <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">通信日志</h4>
      <div class="space-y-1 max-h-48 overflow-y-auto">
        <div v-for="(msg, i) in messageLog" :key="i"
          class="text-xs p-2 rounded-lg"
          :class="msg.highlight ? 'bg-accent-primary/10 text-accent-primary' : 'bg-white/5 text-text-secondary'"
        >
          <span class="font-mono text-text-muted mr-2">[{{ msg.time }}]</span>
          {{ msg.text }}
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import StepIndicator from '../components/StepIndicator.vue'

// ========== 拓扑节点 ==========
const topoNodes = [
  { id: 'h1',     label: 'H1',        shortLabel: 'H1',  ip: '192.168.1.100',  color: '#3b82f6' },
  { id: 'switch', label: '交换机',     shortLabel: 'SW',  ip: 'N/A',             color: '#6b7280' },
  { id: 'router', label: '路由器/网关', shortLabel: 'R',   ip: '192.168.1.1',    color: '#f59e0b' },
  { id: 'dns',    label: 'DNS服务器',  shortLabel: 'DNS', ip: '192.168.1.1',    color: '#00d4ff' },
  { id: 'www',    label: 'www.lessybest.com', shortLabel: 'WWW', ip: '93.184.216.34', color: '#10b981' },
]

// ========== 状态 ==========
const stepIndex = ref(-1)
const playing = ref(false)
const speed = ref(1200)
const speedOptions = [
  { label: '慢速', value: 2500 },
  { label: '正常', value: 1200 },
  { label: '快速', value: 500 },
]
let playTimer = null
const messageLog = ref([])

// ========== 计算属性 ==========
const currentStep = computed(() => {
  if (stepIndex.value < 0 || stepIndex.value >= steps.value.length) return null
  return steps.value[stepIndex.value]
})

const currentArpTable = computed(() => currentStep.value?.arpTableAfter || [])
const currentMacTable = computed(() => currentStep.value?.macTableAfter || [])
const currentDnsCache = computed(() => currentStep.value?.dnsCacheAfter || [])

function isNodeHighlighted(id) {
  return currentStep.value?.highlightNodes?.includes(id) || false
}

function addLog(text, highlight = false) {
  const now = new Date()
  const time = now.toTimeString().slice(0, 8)
  messageLog.value.push({ time, text, highlight })
}

// ========== 8步完整流程 ==========
const steps = ref([
  // Step 1
  {
    id: 1,
    title: 'Step 1：H1 检查 DNS 缓存',
    description: 'H1 在浏览器输入 www.lessybest.com，操作系统先检查本地 DNS 缓存。本演示设定为缓存未命中，需要向 DNS 服务器发起查询。同时检查 ARP 缓存中是否有网关 192.168.1.1 的 MAC 地址。',
    protocol: 'DNS',
    protocolColor: '#00d4ff',
    arpTableAfter: [],
    macTableAfter: [{ mac: '00:11:22:33:44:01', port: '端口1', age: '刚学习', new: true }],
    dnsCacheAfter: [],
    tcpState: '未建立',
    highlightNodes: ['h1'],
    packetDetail: {
      '操作': '浏览器发起 http://www.lessybest.com 请求',
      'DNS缓存': '未命中（首次访问）',
      'ARP缓存(网关)': '192.168.1.1 → 未知',
      '决定动作': '先发起 ARP Request 解析网关 MAC',
    },
    protocolStack: [
      { layer: '应用层', content: 'HTTP Request: GET / www.lessybest.com', color: '#00d4ff' },
      { layer: '传输层', content: '（等待 DNS 解析）', color: '#6b7280' },
      { layer: '网络层', content: '查路由表：默认路由 → 网关 192.168.1.1', color: '#7c3aed' },
      { layer: '链路层', content: 'ARP 缓存空 → 需广播 ARP Request', color: '#f59e0b' },
    ],
  },
  // Step 2
  {
    id: 2,
    title: 'Step 2：ARP Request 广播（Who has 192.168.1.1?）',
    description: 'H1 构造 ARP Request 广播帧：目标 MAC = FF:FF:FF:FF:FF:FF，EtherType = 0x0806。ARP 报文内：Sender IP=192.168.1.100，Sender MAC=00:11:22:33:44:01，Target IP=192.168.1.1，Target MAC=00:00:00:00:00:00。交换机收到广播帧，学习 H1 MAC→端口1，然后泛洪到所有端口。',
    protocol: 'ARP',
    protocolColor: '#f59e0b',
    arpTableAfter: [],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: '端口1', age: '10秒', new: false },
    ],
    dnsCacheAfter: [],
    tcpState: '未建立',
    highlightNodes: ['h1', 'switch', 'router'],
    broadcast: true,
    packetDetail: {
      '以太网帧类型': 'EtherType = 0x0806 (ARP)',
      'ARP Opcode': '1 (Request)',
      'Sender IP': '192.168.1.100',
      'Sender MAC': '00:11:22:33:44:01',
      'Target IP': '192.168.1.1',
      'Target MAC': '00:00:00:00:00:00（未知填0）',
      '广播地址': 'FF:FF:FF:FF:FF:FF',
      '交换机动作': '学习 H1 MAC→端口1，泛洪到所有其他端口',
    },
    protocolStack: [
      { layer: '应用层', content: '（无）', color: '#6b7280' },
      { layer: '传输层', content: '（无）', color: '#6b7280' },
      { layer: '网络层', content: '（ARP 直接承载于链路层）', color: '#6b7280' },
      { layer: '链路层', content: 'ARP Request: Who has 192.168.1.1? Tell 192.168.1.100', color: '#f59e0b' },
    ],
  },
  // Step 3
  {
    id: 3,
    title: 'Step 3：ARP Reply 单播（192.168.1.1 is at 00:AA:BB:CC:DD:01）',
    description: '路由器收到 ARP Request，发现 Target IP = 自己 IP，于是构造 ARP Reply 单播帧：Opcode=2，Sender IP=192.168.1.1，Sender MAC=00:AA:BB:CC:DD:01，Target IP=192.168.1.100，Target MAC=00:11:22:33:44:01。交换机收到单播帧，查 MAC 表转发到端口1。H1 收到 Reply，将 192.168.1.1 ↔ 00:AA:BB:CC:DD:01 写入 ARP 缓存。',
    protocol: 'ARP',
    protocolColor: '#f59e0b',
    arpTableAfter: [{ ip: '192.168.1.1', mac: '00:AA:BB:CC:DD:01', ttl: '20分钟', type: '动态', new: true }],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: '端口1', age: '30秒', new: false },
      { mac: '00:AA:BB:CC:DD:01', port: '端口2', age: '刚学习', new: true },
    ],
    dnsCacheAfter: [],
    tcpState: '未建立',
    highlightNodes: ['router', 'switch', 'h1'],
    packetDetail: {
      '以太网帧类型': 'EtherType = 0x0806 (ARP)',
      'ARP Opcode': '2 (Reply)',
      'Sender IP': '192.168.1.1',
      'Sender MAC': '00:AA:BB:CC:DD:01',
      'Target IP': '192.168.1.100',
      'Target MAC': '00:11:22:33:44:01',
      '路由器动作': '将 H1 的 IP-MAC 映射写入自己 ARP 缓存',
      '交换机动作': '学习路由器 MAC→端口2，查表转发到端口1',
    },
    protocolStack: [
      { layer: '应用层', content: '（无）', color: '#6b7280' },
      { layer: '传输层', content: '（无）', color: '#6b7280' },
      { layer: '网络层', content: '（ARP 承载于链路层）', color: '#6b7280' },
      { layer: '链路层', content: 'ARP Reply: 192.168.1.1 is at 00:AA:BB:CC:DD:01', color: '#f59e0b' },
    ],
  },
  // Step 4
  {
    id: 4,
    title: 'Step 4：发送 DNS 递归查询（UDP 端口 53）',
    description: 'H1 已获知网关 MAC，现在构造 DNS 查询报文。应用层：DNS Query（递归查询 www.lessybest.com 的 A 记录）；传输层：UDP 数据报，源端口随机（如 49152），目标端口 53；网络层：源 IP=192.168.1.100，目标 IP=192.168.1.1（本地 DNS）；链路层：源 MAC=00:11:22:33:44:01，目标 MAC=00:AA:BB:CC:DD:01（网关）。',
    protocol: 'DNS',
    protocolColor: '#00d4ff',
    arpTableAfter: [{ ip: '192.168.1.1', mac: '00:AA:BB:CC:DD:01', ttl: '20分钟', type: '动态', new: false }],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: '端口1', age: '1分钟', new: false },
      { mac: '00:AA:BB:CC:DD:01', port: '端口2', age: '30秒', new: false },
    ],
    dnsCacheAfter: [],
    tcpState: '未建立',
    highlightNodes: ['h1', 'switch', 'router', 'dns'],
    packetDetail: {
      '事务 ID': '0x1a2b（随机数，匹配请求与响应）',
      '标志位': 'RD=1（期望递归查询），AA=0（非权威回答）',
      '问题数': '1（www.lessybest.com A 记录）',
      '回答数': '0（查询阶段）',
      '查询类型': 'A（IPv4 地址）',
      '查询类': 'IN（Internet）',
      '传输协议': 'UDP（DNS 通常走 UDP，报文大于 512B 时转 TCP）',
      '目标端口': '53',
    },
    protocolStack: [
      { layer: '应用层', content: 'DNS Query: www.lessybest.com A（递归）', color: '#00d4ff' },
      { layer: '传输层', content: 'UDP Src:49152 → Dst:53', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 192.168.1.1', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:11:22:33:44:01 → Dst MAC: 00:AA:BB:CC:DD:01', color: '#f59e0b' },
    ],
  },
  // Step 5
  {
    id: 5,
    title: 'Step 5：收到 DNS 响应（www.lessybest.com = 93.184.216.34）',
    description: '本地 DNS 服务器完成递归查询后，将结果返回给 H1。DNS Response 报文：事务 ID 与查询匹配，标志位 AA=1（权威回答）或 RA=1（支持递归），回答数=1，www.lessybest.com 的 A 记录为 93.184.216.34，TTL=300秒（5分钟）。H1 收到响应后，将 www.lessybest.com ↔ 93.184.216.34 写入 DNS 缓存。',
    protocol: 'DNS',
    protocolColor: '#00d4ff',
    arpTableAfter: [{ ip: '192.168.1.1', mac: '00:AA:BB:CC:DD:01', ttl: '20分钟', type: '动态', new: false }],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: '端口1', age: '2分钟', new: false },
      { mac: '00:AA:BB:CC:DD:01', port: '端口2', age: '1分钟', new: false },
    ],
    dnsCacheAfter: [{ domain: 'www.lessybest.com', ip: '93.184.216.34', ttl: '300秒', new: true }],
    tcpState: '未建立',
    highlightNodes: ['dns', 'router', 'switch', 'h1'],
    packetDetail: {
      '事务 ID': '0x1a2b（与查询匹配）',
      '标志位': 'AA=1（权威回答），RA=1（支持递归）',
      '问题数': '1（www.lessybest.com A）',
      '回答数': '1（A 记录）',
      '回答内容': 'www.lessybest.com A 93.184.216.34',
      'TTL': '300秒（5分钟）',
      '传输协议': 'UDP（响应仍走 UDP）',
    },
    protocolStack: [
      { layer: '应用层', content: 'DNS Response: www.lessybest.com A = 93.184.216.34', color: '#00d4ff' },
      { layer: '传输层', content: 'UDP Src:53 → Dst:49152', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.1 → Dst: 192.168.1.100', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:AA:BB:CC:DD:01 → Dst MAC: 00:11:22:33:44:01', color: '#f59e0b' },
    ],
  },
  // Step 6
  {
    id: 6,
    title: 'Step 6：TCP 三次握手（SYN → SYN-ACK → ACK）',
    description: 'H1 已知 www.lessybest.com 的 IP（93.184.216.34），开始建立 TCP 连接。第一次握手：H1 发送 TCP SYN（Seq=1000，标志位 SYN=1），目标端口 80（HTTP）。第二次握手：服务器收到 SYN，回复 SYN-ACK（Seq=5000，Ack=1001，标志位 SYN=1, ACK=1）。第三次握手：H1 发送 ACK（Seq=1001，Ack=5001，标志位 ACK=1）。TCP 连接建立，进入 ESTABLISHED 状态。',
    protocol: 'TCP',
    protocolColor: '#10b981',
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:AA:BB:CC:DD:01', ttl: '20分钟', type: '动态', new: false },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: '端口1', age: '3分钟', new: false },
      { mac: '00:AA:BB:CC:DD:01', port: '端口2', age: '2分钟', new: false },
    ],
    dnsCacheAfter: [{ domain: 'www.lessybest.com', ip: '93.184.216.34', ttl: '300秒', new: false }],
    tcpState: 'ESTABLISHED（连接已建立）',
    highlightNodes: ['h1', 'switch', 'router', 'www'],
    packetDetail: {
      '第1次握手': 'H1 → Server：SYN（Seq=1000）',
      '第2次握手': 'Server → H1：SYN-ACK（Seq=5000, Ack=1001）',
      '第3次握手': 'H1 → Server：ACK（Seq=1001, Ack=5001）',
      '目标端口': '80（HTTP）',
      '窗口大小': '65535（H1），65535（Server）',
      'MSS协商': 'MSS=1460（以太网 MTU 1500 - IP头20B - TCP头20B）',
      '状态变化': 'H1: CLOSED→SYN_SENT；Server: LISTEN→SYN_RCVD→ESTABLISHED；H1: SYN_SENT→ESTABLISHED',
    },
    protocolStack: [
      { layer: '应用层', content: '（TCP 握手阶段，尚未发送 HTTP 数据）', color: '#6b7280' },
      { layer: '传输层', content: 'TCP SYN（Seq=1000）→ SYN-ACK（Seq=5000, Ack=1001）→ ACK（Ack=5001）', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 93.184.216.34', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:11:22:33:44:01 → Dst MAC: 00:AA:BB:CC:DD:01（网关）', color: '#f59e0b' },
    ],
  },
  // Step 7
  {
    id: 7,
    title: 'Step 7：发送 HTTP GET 请求（Application Data）',
    description: 'TCP 连接建立后，H1 构造 HTTP GET 请求报文。应用层：GET / HTTP/1.1，Host: www.lessybest.com，User-Agent: Mozilla/5.0...；传输层：TCP 报文（Seq=1001，Ack=5001，标志位 PSH=1, ACK=1），源端口 49152，目标端口 80；网络层：源 IP=192.168.1.100，目标 IP=93.184.216.34；链路层：源 MAC=00:11:22:33:44:01，目标 MAC=00:AA:BB:CC:DD:01（网关）。',
    protocol: 'HTTP',
    protocolColor: '#ef4444',
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:AA:BB:CC:DD:01', ttl: '20分钟', type: '动态', new: false },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: '端口1', age: '4分钟', new: false },
      { mac: '00:AA:BB:CC:DD:01', port: '端口2', age: '3分钟', new: false },
    ],
    dnsCacheAfter: [{ domain: 'www.lessybest.com', ip: '93.184.216.34', ttl: '300秒', new: false }],
    tcpState: 'ESTABLISHED（数据传输中）',
    highlightNodes: ['h1', 'switch', 'router', 'www'],
    packetDetail: {
      'HTTP方法': 'GET / HTTP/1.1',
      'Host': 'www.lessybest.com',
      'User-Agent': 'Mozilla/5.0（Windows NT 10.0; Win64; x64）',
      'Accept': 'text/html,application/xhtml+xml',
      'Connection': 'keep-alive',
      'TCP Seq': '1001（确认号）',
      'TCP Ack': '5001',
      'TCP 标志位': 'PSH=1, ACK=1（推送数据 + 确认）',
      '目标端口': '80（HTTP）',
    },
    protocolStack: [
      { layer: '应用层', content: 'HTTP GET / HTTP/1.1 Host: www.lessybest.com', color: '#ef4444' },
      { layer: '传输层', content: 'TCP Seq=1001, Ack=5001, PSH+ACK（源端口 49152 → 80）', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 93.184.216.34', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:11:22:33:44:01 → Dst MAC: 00:AA:BB:CC:DD:01（网关）', color: '#f59e0b' },
    ],
  },
  // Step 8
  {
    id: 8,
    title: 'Step 8：收到 HTTP 响应（200 OK + HTML 页面）',
    description: 'Web 服务器处理 GET 请求，返回 HTTP 响应报文。应用层：HTTP/1.1 200 OK，Content-Type: text/html，Content-Length: 1024，响应体为 HTML 页面内容；传输层：TCP 报文（Seq=5001，Ack=1100，标志位 PSH=1, ACK=1）；网络层：源 IP=93.184.216.34，目标 IP=192.168.1.100；链路层：源 MAC=服务器网卡 MAC，目标 MAC=网关 MAC（经互联网路由）。H1 收到响应后，浏览器渲染 HTML 页面，页面加载完成。',
    protocol: 'HTTP',
    protocolColor: '#ef4444',
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:AA:BB:CC:DD:01', ttl: '20分钟', type: '动态', new: false },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: '端口1', age: '5分钟', new: false },
      { mac: '00:AA:BB:CC:DD:01', port: '端口2', age: '4分钟', new: false },
    ],
    dnsCacheAfter: [{ domain: 'www.lessybest.com', ip: '93.184.216.34', ttl: '300秒', new: false }],
    tcpState: 'ESTABLISHED（可 keep-alive 或四次挥手关闭）',
    highlightNodes: ['www', 'router', 'switch', 'h1'],
    packetDetail: {
      'HTTP状态': '200 OK',
      'HTTP版本': 'HTTP/1.1',
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Length': '1024',
      'Server': 'nginx/1.18.0',
      'TCP Seq': '5001',
      'TCP Ack': '1100',
      'TCP 标志位': 'PSH=1, ACK=1（推送响应数据 + 确认）',
      '连接处理': 'Connection: keep-alive（可复用 TCP 连接）',
      '页面渲染': '浏览器收到 HTML → 解析 DOM → 渲染页面 → 加载完成',
    },
    protocolStack: [
      { layer: '应用层', content: 'HTTP/1.1 200 OK Content-Type: text/html（1024 bytes）', color: '#ef4444' },
      { layer: '传输层', content: 'TCP Seq=5001, Ack=1100, PSH+ACK（源端口 80 → 49152）', color: '#10b981' },
      { layer: '网络层', content: 'Src: 93.184.216.34 → Dst: 192.168.1.100', color: '#7c3aed' },
      { layer: '链路层', content: '经互联网路由 → 网关 → 交换机 → H1', color: '#f59e0b' },
    ],
  },
])

// ========== 控制函数 ==========
async function handleStart() {
  resetState()
  playing.value = true
  addLog('▶️ 开始自动演示（8步全流程）', true)
  for (let i = 0; i < steps.value.length; i++) {
    if (!playing.value) break
    stepIndex.value = i
    addLog(`📍 Step ${i + 1}: ${steps.value[i].title}`, true)
    await sleep(speed.value)
  }
  playing.value = false
  addLog('🎉 演示完成！H1 已成功访问 www.lessybest.com', true)
}

function handleNext() {
  if (stepIndex.value < steps.value.length - 1) {
    stepIndex.value++
    addLog(`⏭️ 跳到 Step ${stepIndex.value + 1}: ${steps.value[stepIndex.value].title}`)
  }
}

function handlePrev() {
  if (stepIndex.value > 0) {
    stepIndex.value--
    addLog(`⏮️ 回到 Step ${stepIndex.value + 1}: ${steps.value[stepIndex.value].title}`)
  }
}

function handleReset() {
  playing.value = false
  stepIndex.value = -1
  messageLog.value = []
  addLog('🔄 已重置，点击「开始演示」重新播放', false)
}

function resetState() {
  stepIndex.value = -1
  messageLog.value = []
}

function sleep(ms) {
  return new Promise(resolve => {
    playTimer = setTimeout(resolve, ms)
  })
}

onUnmounted(() => {
  if (playTimer) clearTimeout(playTimer)
})
</script>
