<template>
  <div class="min-h-screen px-4 md:px-8 pb-16 max-w-6xl mx-auto">
    <div class="pt-8 pb-6 fade-up">
      <h1 class="text-2xl font-bold mb-2">TCP/IP五层模型知识体系</h1>
      <p class="text-text-secondary text-sm">
        系统学习计算机网络核心知识点，支持增删改查，内置知识图谱展示层次关系。
      </p>
    </div>

    <!-- Search Bar -->
    <div class="glass-card p-4 mb-6 flex gap-3 items-center fade-up stagger-1">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="#6b7280" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索知识点..."
          class="w-full bg-white/5 border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary transition-colors"
          @input="handleSearch"
        />
      </div>
      <button class="btn-primary text-sm shrink-0" @click="showAddModal = true">
        + 新增知识点
      </button>
    </div>

    <!-- Search Results Banner -->
    <div v-if="searchQuery && searchResults.length > 0" class="glass-card p-4 mb-6 fade-up stagger-1">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-text-muted">搜索结果：<span class="text-accent-primary font-semibold">{{ searchResults.length }}</span> 条</span>
        <button class="btn-ghost text-xs" @click="searchQuery = ''; searchResults = []">清除</button>
      </div>
      <div class="space-y-2">
        <div
          v-for="item in searchResults" :key="item.id"
          class="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-border-subtle transition-colors"
        >
          <span class="shrink-0 text-[10px] px-2 py-0.5 rounded mt-0.5 font-semibold"
            :style="{ background: item.layer_color + '20', color: item.layer_color }">
            {{ item.layer_name }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-text-primary">{{ item.title }}</div>
            <div class="text-xs text-text-muted mt-0.5 line-clamp-2">{{ item.content }}</div>
          </div>
          <div class="flex gap-1 shrink-0">
            <button class="btn-ghost text-xs px-2 py-1" @click="editItem(item)">编辑</button>
            <button class="btn-ghost text-xs px-2 py-1 text-red-400 hover:text-red-300" @click="deleteItem(item.id)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 fade-up stagger-2" v-if="!searchQuery">
      <button
        v-for="layer in layers"
        :key="layer.id"
        class="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
        :class="activeLayer === layer.id
          ? 'text-white border-transparent'
          : 'border-border-subtle text-text-muted hover:border-border-hover hover:text-text-secondary'"
        :style="activeLayer === layer.id ? { backgroundColor: layer.color + '25', borderColor: layer.color, color: layer.color } : {}"
        @click="activeLayer = layer.id"
      >
        {{ layer.name }}
      </button>
      <button
        class="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 border-border-subtle text-text-muted hover:border-border-hover hover:text-text-secondary"
        :class="{ '!border-accent-secondary !text-accent-secondary !bg-accent-secondary/10': activeLayer === 'graph' }"
        @click="activeLayer = 'graph'"
      >
        知识图谱
      </button>
    </div>

    <!-- Knowledge List (by layer) -->
    <div v-if="!searchQuery && activeLayer !== 'graph'" class="space-y-3 fade-up stagger-3">
      <div v-if="knowledgeItems.length === 0" class="glass-card p-8 text-center">
        <div class="text-text-muted text-sm">该层暂无知识点，点击上方「新增知识点」添加</div>
      </div>
      <div
        v-for="item in knowledgeItems"
        :key="item.id"
        class="glass-card p-5 group hover:border-border-hover transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold text-sm text-text-primary">{{ item.title }}</h3>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">
                #{{ item.id }}
              </span>
            </div>
            <p class="text-text-secondary text-sm leading-relaxed mb-2">{{ item.content }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in (item.tags || '').split(',').filter(Boolean)"
                :key="tag"
                class="text-[10px] px-2 py-0.5 rounded-full"
                :style="{ background: activeLayerColor + '15', color: activeLayerColor, border: `1px solid ${activeLayerColor}30` }"
              >
                {{ tag.trim() }}
              </span>
            </div>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button class="btn-ghost text-xs px-2.5 py-1" @click="editItem(item)">编辑</button>
            <button class="btn-ghost text-xs px-2.5 py-1 text-red-400 hover:text-red-300" @click="deleteItem(item.id)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Knowledge Graph -->
    <div v-if="activeLayer === 'graph' && !searchQuery" class="fade-up stagger-3">
      <div class="glass-card p-4 mb-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-muted uppercase tracking-widest">TCP/IP 五层模型知识图谱</h3>
          <div class="flex gap-2">
            <button class="btn-ghost text-xs" @click="graphLayout = 'layered'" :class="{ 'text-accent-primary': graphLayout === 'layered' }">分层布局</button>
            <button class="btn-ghost text-xs" @click="graphLayout = 'force'" :class="{ 'text-accent-primary': graphLayout === 'force' }">力导向布局</button>
            <button class="btn-ghost text-xs" @click="resetGraphView" title="重置视图">🔄 重置</button>
          </div>
        </div>
      </div>
      <div class="glass-card overflow-hidden" style="height: 750px; cursor: grab;" @mouseleave="draggedNode = null; isPanning = false">
        <svg ref="graphRef" class="w-full h-full" viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet" @mousemove="onGraphMouseMove" @mouseup="onGraphMouseUp" @mousedown="onGraphMouseDown" @mouseleave="draggedNode = null; isPanning = false" @wheel="onWheel($event)" style="user-select:none;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%222%22 cy=%222%22 r=%221%22 fill=%22rgba(255,255,255,0.04)%22/></svg>') repeat">
          <g :transform="graphTransform">
          <defs>
            <!-- 箭头 -->
            <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill="rgba(255,255,255,0.35)"/>
            </marker>
            <!-- 发光滤镜 -->
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
            </filter>
          </defs>

          <!-- ── 连边（曲线弧线） ── -->
          <g v-for="link in graphLinks" :key="'lk_' + link.source + '_' + link.target">
            <path
              :d="'M' + getNodeX(link.source) + ',' + (getNodeY(link.source) + 28) + ' Q' + getNodeX(link.source) + ',' + ((getNodeY(link.source) + getNodeY(link.target)) / 2) + ' ' + getNodeX(link.target) + ',' + (getNodeY(link.target) - 36)"
              fill="none"
              :stroke="getNodeColorById(link.target) || 'rgba(255,255,255,0.08)'"
              stroke-width="1"
              stroke-opacity="0.25"
              marker-end="url(#arrow)"
            />
          </g>

          <!-- ── 层级节点（磨砂胶囊） ── -->
          <g v-for="node in graphNodes.filter(n => n.isLayer)" :key="'ln_' + node.id" filter="url(#softShadow)">
            <!-- 外发光 -->
            <rect :x="node.x - 72" :y="node.y - 20" width="144" height="40" rx="20"
              :fill="node.color + '15'" />
            <!-- 主体 -->
            <rect :x="node.x - 68" :y="node.y - 18" width="136" height="36" rx="18"
              fill="rgba(20,20,30,0.9)"
              :stroke="node.color" stroke-width="1.5" stroke-opacity="0.5" />
            <!-- 左侧色条 -->
            <rect :x="node.x - 68" :y="node.y - 18" width="3" height="36" rx="1.5"
              :fill="node.color" opacity="0.8" />
            <!-- 标签文字 -->
            <text :x="node.x - 20" :y="node.y + 4"
              text-anchor="middle" dominant-baseline="middle"
              fill="#e8e8f5" font-size="13" font-weight="600" font-family="Inter" letter-spacing="0.5">
              {{ node.label }}
            </text>
          </g>

          <!-- ── 知识点节点 ── -->
          <g
            v-for="node in graphNodes.filter(n => !n.isLayer)"
            :key="'kn_' + node.id"
            class="cursor-pointer"
            @mousedown.stop="startDrag(node, $event)"
            @click.stop="selectedGraphNode = selectedGraphNode === node.id ? null : node.id"
            @mouseenter="hoveredNode = node.id"
            @mouseleave="hoveredNode = null"
          >
            <!-- 呼吸光晕（选中/悬停） -->
            <circle v-if="nodeHighlight(node.id)"
              :cx="node.x" :cy="node.y" r="44"
              :fill="node.color + '12'" filter="url(#glow)" />
            <!-- 外圈 -->
            <circle :cx="node.x" :cy="node.y" r="30"
              fill="none"
              :stroke="node.color" stroke-width="1.2" stroke-opacity="0.35" />
            <!-- 主体圆 -->
            <circle :cx="node.x" :cy="node.y" r="24"
              fill="rgba(16,16,24,0.95)"
              :stroke="node.color" stroke-width="2"
              :stroke-opacity="hoveredNode && hoveredNode !== node.id ? 0.3 : 0.8" />
            <!-- 中心亮点 -->
            <circle :cx="node.x" :cy="node.y" r="3.5"
              :fill="node.color" opacity="0.85" />
            <!-- 标签背景 -->
            <rect :x="node.x - 48" :y="node.y + 36" width="96" height="19" rx="9.5"
              fill="rgba(20,20,30,0.82)"
              :stroke="node.color" stroke-width="0.5" stroke-opacity="0.2" />
            <!-- 标签文字 -->
            <text :x="node.x" :y="node.y + 49"
              text-anchor="middle" dominant-baseline="middle"
              :fill="node.color" font-size="9.5" font-weight="500" font-family="Inter" letter-spacing="0.3"
            >{{ node.label.length > 12 ? node.label.slice(0, 11) + '…' : node.label }}</text>
          </g>

          <!-- ── Tooltip 信息卡 ── -->
          <g v-if="tooltipNode" filter="url(#softShadow)">
            <rect :x="tooltipNode.x - 105" :y="tooltipNode.y - 90"
              width="210" height="72" rx="10"
              fill="rgba(24,24,38,0.97)"
              :stroke="getNodeColorById(tooltipNode.id) || '#666'" stroke-width="1" stroke-opacity="0.4" />
            <!-- 标题线 -->
            <line :x1="tooltipNode.x - 90" :y1="tooltipNode.y - 72"
              :x2="tooltipNode.x + 90" :y2="tooltipNode.y - 72"
              :stroke="getNodeColorById(tooltipNode.id) || '#666'" stroke-width="1" stroke-opacity="0.15" />
            <text :x="tooltipNode.x" :y="tooltipNode.y - 64"
              text-anchor="middle" fill="#f0f0f8" font-size="12" font-weight="600" font-family="Inter">
              {{ tooltipNode.label }}
            </text>
            <text :x="tooltipNode.x" :y="tooltipNode.y - 48"
              text-anchor="middle" :fill="getNodeColorById(tooltipNode.id) || '#888'" font-size="10" font-family="Inter">
              {{ tooltipNode.layer_name }}
            </text>
            <text :x="tooltipNode.x" :y="tooltipNode.y - 34"
              text-anchor="middle" fill="rgba(200,200,210,0.5)" font-size="8" font-family="Inter">
              {{ (tooltipNode.content || '').slice(0, 44) }}…
            </text>
          </g>
          </g>
        </svg>
      </div>
      
      <!-- Graph Node Detail Panel -->
      <div v-if="selectedGraphNode && !selectedGraphNode.toString().startsWith('layer_')" class="glass-card p-5 mt-4 fade-up">
        <div class="flex items-start justify-between mb-3">
          <h4 class="font-semibold text-text-primary">{{ getNodeKnowledge(selectedGraphNode)?.title }}</h4>
          <button class="btn-ghost text-xs" @click="selectedGraphNode = null">关闭</button>
        </div>
        <p class="text-sm text-text-secondary mb-3">{{ getNodeKnowledge(selectedGraphNode)?.content }}</p>
        <div class="flex flex-wrap gap-1.5 mb-3">
          <span
            v-for="tag in (getNodeKnowledge(selectedGraphNode)?.tags || '').split(',').filter(Boolean)"
            :key="tag"
            class="text-[10px] px-2 py-0.5 rounded-full"
            :style="{ background: getNodeLayerColor(selectedGraphNode) + '15', color: getNodeLayerColor(selectedGraphNode), border: `1px solid ${getNodeLayerColor(selectedGraphNode)}30` }"
          >
            {{ tag.trim() }}
          </span>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary text-xs" @click="editGraphNode(selectedGraphNode)">编辑</button>
          <button class="btn-ghost text-xs text-red-400" @click="deleteGraphNode(selectedGraphNode)">删除</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingItem" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative glass-card p-6 w-full max-w-md">
        <h3 class="font-semibold text-base mb-4">{{ editingItem ? '编辑知识点' : '新增知识点' }}</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-text-muted mb-1 block">所属层次 *</label>
            <select
              v-model="form.layer_id"
              class="w-full bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
            >
              <option value="">选择层次</option>
              <option v-for="l in layers" :key="l.id" :value="l.id">{{ l.name }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-text-muted mb-1 block">标题 *</label>
            <input v-model="form.title" type="text" class="w-full bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary" placeholder="知识点标题" />
          </div>
          <div>
            <label class="text-xs text-text-muted mb-1 block">内容</label>
            <textarea v-model="form.content" rows="3" class="w-full bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary resize-none" placeholder="详细说明..."></textarea>
          </div>
          <div>
            <label class="text-xs text-text-muted mb-1 block">标签（用逗号分隔）</label>
            <input v-model="form.tags" type="text" class="w-full bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary" placeholder="HTTP, Web, TCP" />
          </div>
        </div>
        <div class="flex gap-2 justify-end mt-5">
          <button class="btn-ghost text-sm" @click="closeModal">取消</button>
          <button class="btn-primary text-sm" @click="saveItem">{{ editingItem ? '保存修改' : '添加' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

const layers = ref([])
const knowledge = ref([])
const activeLayer = ref(1)
const searchQuery = ref('')
const searchResults = ref([])
const showAddModal = ref(false)
const editingItem = ref(null)
const graphLayout = ref('layered')
const graphRef = ref(null)
const hoveredNode = ref(null)
const selectedGraphNode = ref(null)
const graphScale = ref(1)
const graphOffset = ref({ x: 0, y: 0 })
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })

const form = ref({ layer_id: '', title: '', content: '', tags: '' })

const api = axios.create({ baseURL: '/api' })

onMounted(async () => {
  await loadLayers()
  await loadKnowledge()
  window.addEventListener('mouseup', onWindowMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', onWindowMouseUp)
})

// Global mouseup — prevents sticky drag when mouse leaves SVG
const onWindowMouseUp = () => {
  draggedNode.value = null
  isPanning.value = false
}

const loadLayers = async () => {
  try {
    const res = await api.get('/layers')
    if (res.data.success) layers.value = res.data.data
  } catch (e) { console.error(e) }
}

const loadKnowledge = async () => {
  try {
    const res = await api.get('/knowledge')
    if (res.data.success) knowledge.value = res.data.data
  } catch (e) { console.error(e) }
}

const activeLayerColor = computed(() => layers.value.find(l => l.id === activeLayer.value)?.color || '#00d4ff')

const knowledgeItems = computed(() =>
  knowledge.value.filter(k => k.layer_id === activeLayer.value)
)

// Graph data
const graphLayers = ref([])

const buildGraphLayers = () => {
  const ordered = layers.value.slice().sort((a, b) => a.sort_order - b.sort_order)
  const width = 900
  const startX = 100
  const step = (width - 200) / (ordered.length - 1 || 1)
  graphLayers.value = ordered.map((l, i) => ({
    ...l,
    x: startX + i * step,
    y: 80,
  }))
}

const graphNodes = ref([])
const graphLinks = ref([])

const buildGraphData = () => {
  const nodes = []
  const links = []
  const layerMap = {}
  graphLayers.value.forEach(l => { layerMap[l.id] = l })

  const svgW = 900, svgH = 500

  if (graphLayout.value === 'layered') {
    // ── 分层布局：每层一列，知识点节点整齐排在层级节点下方 ──
    const layerSpacing = Math.min(200, (svgW - 200) / Math.max(graphLayers.value.length - 1, 1))
    const startX = 100
    const layerY = 80
    const kNodeStartY = 170
    const kNodeGapY = 100   // 纵向间距
    const maxPerCol = 7       // 每列最多显7个，超出向下延伸

    graphLayers.value.forEach((l, li) => {
      const lx = startX + li * layerSpacing

      // ── 层级节点（大号胶囊形）──
      nodes.push({
        id: 'layer_' + l.id,
        label: l.name,
        layer_name: l.name,
        layer_id: l.id,
        color: l.color,
        x: lx,
        y: layerY,
        baseX: lx,
        baseY: layerY,
        isLayer: true,
      })

      // ── 该层知识点：整齐列阵 ──
      const kList = knowledge.value.filter(k => k.layer_id === l.id)
      kList.forEach((k, ki) => {
        const col = Math.floor(ki / maxPerCol)
        const row = ki % maxPerCol
        nodes.push({
          id: k.id,
          label: k.title,
          content: k.content,
          layer_id: k.layer_id,
          layer_name: l.name,
          color: l.color,
          x: lx + col * 36,
          y: kNodeStartY + row * kNodeGapY,
          baseX: lx,
          baseY: kNodeStartY + row * kNodeGapY,
          isLayer: false,
        })
        links.push({ source: 'layer_' + l.id, target: k.id, layer: l.name })
      })
    })
  } else {
    // ── 力导向布局：正确模拟（斥力 + 引力 + 冷却） ──
    const allNodes = []

    // 层级节点：均匀分布在椭圆上
    const lc = Math.max(graphLayers.value.length, 1)
    graphLayers.value.forEach((l, li) => {
      const ang = (2 * Math.PI * li) / lc - Math.PI / 2
      allNodes.push({
        id: 'layer_' + l.id,
        label: l.name,
        layer_name: l.name,
        layer_id: l.id,
        color: l.color,
        isLayer: true,
        x: svgW / 2 + 260 * Math.cos(ang),
        y: svgH / 2 + 150 * Math.sin(ang),
      })
    })

    // 知识点节点：初始位置靠近所属层级节点
    knowledge.value.forEach(k => {
      const ln = allNodes.find(n => n.id === 'layer_' + k.layer_id)
      allNodes.push({
        id: k.id,
        label: k.title,
        content: k.content,
        layer_id: k.layer_id,
        layer_name: ln?.layer_name || '',
        color: ln?.color || '#888',
        isLayer: false,
        x: (ln?.x || svgW / 2) + (Math.random() - 0.5) * 80,
        y: (ln?.y || svgH / 2) + (Math.random() - 0.5) * 80,
      })
    })

    // ── 力模拟（200次迭代，alpha冷却） ──
    let alpha = 1.0
    const alphaDecay = 0.97
    const repulse = 900    // 斥力强度
    const attract = 0.06    // 引力强度
    const centerGravity = 0.015  // 中心引力

    for (let iter = 0; iter < 200; iter++) {
      alpha *= alphaDecay
      if (alpha < 0.005) break

      // 斥力：所有节点对
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          let dx = allNodes[j].x - allNodes[i].x
          let dy = allNodes[j].y - allNodes[i].y
          let dist = Math.sqrt(dx * dx + dy * dy) || 1
          // 同层知识点斥力更强（防止标签重叠）
          const same = !allNodes[i].isLayer && !allNodes[j].isLayer && allNodes[i].layer_id === allNodes[j].layer_id
          const f = repulse / dist * alpha * (same ? 2.0 : 1.0)
          const fx = (dx / dist) * f
          const fy = (dy / dist) * f
          allNodes[i].x -= fx; allNodes[i].y -= fy
          allNodes[j].x += fx; allNodes[j].y += fy
        }
      }

      // 引力：沿连边（知识点 → 所属层级节点）
      knowledge.value.forEach(k => {
        const lfn = allNodes.find(n => n.id === 'layer_' + k.layer_id)
        const kn = allNodes.find(n => n.id === k.id)
        if (!lfn || !kn) return
        let dx = lfn.x - kn.x, dy = lfn.y - kn.y
        let dist = Math.sqrt(dx * dx + dy * dy) || 1
        const f = dist * attract * alpha
        kn.x += (dx / dist) * f
        kn.y += (dy / dist) * f
      })

      // 中心引力（防止飞散）
      for (const n of allNodes) {
        n.x += (svgW / 2 - n.x) * centerGravity * alpha
        n.y += (svgH / 2 - n.y) * centerGravity * alpha
      }
    }

    allNodes.forEach(n => { n.baseX = n.x; n.baseY = n.y; nodes.push(n) })
    knowledge.value.forEach(k => {
      links.push({ source: 'layer_' + k.layer_id, target: k.id, layer: layerMap[k.layer_id]?.name || '' })
    })
  }

  graphNodes.value = nodes
  graphLinks.value = links
}

const getNodeX = (id) => graphNodes.value.find(n => n.id === id)?.x || 0
const getNodeY = (id) => graphNodes.value.find(n => n.id === id)?.y || 0
const getNodeColorById = (id) => {
  const node = graphNodes.value.find(n => n.id === id)
  return node?.color || '#888'
}

const nodeHighlight = (id) => selectedGraphNode.value === id || hoveredNode.value === id

const tooltipNode = computed(() =>
  hoveredNode.value ? graphNodes.value.find(n => n.id === hoveredNode.value) : null
)

// Graph transform for zoom/pan
const graphTransform = computed(() => {
  return `translate(${graphOffset.value.x},${graphOffset.value.y}) scale(${graphScale.value})`
})

watch([layers, activeLayer], () => {
  if (layers.value.length > 0) {
    buildGraphLayers()
    if (activeLayer.value === 'graph') buildGraphData()
  }
}, { immediate: true })

watch([activeLayer, knowledge, graphLayout], () => {
  if (activeLayer.value === 'graph') buildGraphData()
})

// ── Drag ──────────────────────────────────────────────
const draggedNode = ref(null)
const startDrag = (node, e) => {
  if (e.button !== 0) return
  draggedNode.value = node
  isPanning.value = false
  e.stopPropagation()
  e.preventDefault()
}

// Reset graph view
const resetGraphView = () => {
  graphScale.value = 1
  graphOffset.value = { x: 0, y: 0 }
}

const onGraphMouseUp = () => { 
  draggedNode.value = null 
  isPanning.value = false
}

const onGraphMouseMove = (e) => {
  if (draggedNode.value) {
    const rect = graphRef.value.getBoundingClientRect()
    const svgX = (e.clientX - rect.left - graphOffset.value.x) / graphScale.value
    const svgY = (e.clientY - rect.top - graphOffset.value.y) / graphScale.value
    draggedNode.value.x = svgX
    draggedNode.value.y = svgY
  } else if (isPanning.value) {
    const dx = e.clientX - panStart.value.x
    const dy = e.clientY - panStart.value.y
    graphOffset.value.x += dx
    graphOffset.value.y += dy
    panStart.value = { x: e.clientX, y: e.clientY }
  }
}

const onGraphMouseDown = (e) => {
  if (e.target === graphRef.value || e.target.tagName === 'svg') {
    isPanning.value = true
    panStart.value = { x: e.clientX, y: e.clientY }
  }
}

const onWheel = (e) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = graphScale.value * delta
  if (newScale < 0.2 || newScale > 3) return
  
  const rect = graphRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  graphOffset.value.x = mouseX - (mouseX - graphOffset.value.x) * delta
  graphOffset.value.y = mouseY - (mouseY - graphOffset.value.y) * delta
  graphScale.value = newScale
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) { searchResults.value = []; return }
  try {
    const res = await api.get('/search', { params: { q: searchQuery.value } })
    if (res.data.success) searchResults.value = res.data.data
  } catch (e) { console.error(e) }
}

const editItem = (item) => {
  editingItem.value = item
  form.value = { layer_id: item.layer_id, title: item.title, content: item.content, tags: item.tags }
}

const deleteItem = async (id) => {
  if (!confirm('确定删除这条知识点？')) return
  try {
    await api.delete(`/knowledge/${id}`)
    await loadKnowledge()
  } catch (e) { console.error(e) }
}

const saveItem = async () => {
  if (!form.value.layer_id || !form.value.title) return alert('请填写必填项')
  try {
    if (editingItem.value) {
      await api.put(`/knowledge/${editingItem.value.id}`, form.value)
    } else {
      await api.post('/knowledge', form.value)
    }
    await loadKnowledge()
    closeModal()
  } catch (e) { console.error(e) }
}

const closeModal = () => {
  showAddModal.value = false
  editingItem.value = null
  form.value = { layer_id: '', title: '', content: '', tags: '' }
}

// Graph node helpers
const getNodeKnowledge = (id) => {
  if (!id || id.toString().startsWith('layer_')) return null
  return knowledge.value.find(k => k.id === id)
}

const getNodeLayerColor = (id) => {
  const k = getNodeKnowledge(id)
  if (!k) return '#fff'
  const layer = layers.value.find(l => l.id === k.layer_id)
  return layer?.color || '#fff'
}

const editGraphNode = (id) => {
  const k = getNodeKnowledge(id)
  if (k) editItem(k)
}

const deleteGraphNode = async (id) => {
  if (!confirm('确定删除这个知识点？')) return
  await deleteItem(id)
  selectedGraphNode.value = null
}
</script>
