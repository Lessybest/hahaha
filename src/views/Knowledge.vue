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
          </div>
        </div>
      </div>
      <div class="glass-card overflow-hidden" style="height: 600px; cursor: grab;" @mouseleave="isPanning = false; draggedNode = null">
        <svg ref="graphRef" class="w-full h-full" @mousemove="onGraphMouseMove" @mouseup="onGraphMouseUp" @mousedown="onGraphMouseDown" @wheel="onWheel($event)">
          <g :transform="graphTransform">
          <defs>
            <marker id="arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.3)"/>
            </marker>
          </defs>
          <!-- Links -->
          <line
            v-for="link in graphLinks"
            :key="`${link.source}-${link.target}`"
            :x1="getNodeX(link.source)" :y1="getNodeY(link.source)"
            :x2="getNodeX(link.target)" :y2="getNodeY(link.target)"
            stroke="rgba(255,255,255,0.15)"
            stroke-width="1"
            stroke-dasharray="4 3"
            marker-end="url(#arrow-default)"
          />
          <!-- Layer labels -->
          <g v-for="node in graphNodes.filter(n => n.isLayer)" :key="node.id">
            <rect
              :x="node.x - 40" :y="node.y - 30"
              width="80" height="22"
              rx="11"
              :fill="node.color + '15'"
              :stroke="node.color + '40'"
              stroke-width="1"
            />
            <text
              :x="node.x" y="-15"
              text-anchor="middle"
              :fill="node.color"
              font-size="11"
              font-weight="600"
              font-family="Inter"
            >{{ node.label }}</text>
          </g>
          <!-- Nodes -->
          <g
            v-for="node in graphNodes"
            :key="node.id"
            class="cursor-pointer"
            @mousedown.stop="startDrag(node, $event)"
            @click="selectedGraphNode = selectedGraphNode === node.id ? null : node.id"
            @mouseenter="hoveredNode = node.id"
            @mouseleave="hoveredNode = null"
          >
            <circle
              :cx="node.x" :cy="node.y" r="nodeHighlight(node.id) ? 32 : 26"
              :fill="nodeHighlight(node.id) ? node.color + '30' : '#111118'"
              :stroke="node.color"
              :stroke-width="nodeHighlight(node.id) ? 2 : 1.5"
              :opacity="hoveredNode && hoveredNode !== node.id ? 0.6 : 1"
            />
            <text
              :x="node.x" :y="node.y + 4"
              text-anchor="middle"
              :fill="node.color"
              font-size="10"
              font-weight="600"
              font-family="Inter"
            >{{ node.label.length > 8 ? node.label.slice(0, 7) + '…' : node.label }}</text>
          </g>
          <!-- Tooltip -->
          <g v-if="tooltipNode" transform="translate(0, 0)">
            <rect
              :x="tooltipNode.x - 100" :y="tooltipNode.y - 80"
              width="200" height="60"
              rx="8"
              fill="#1a1a24"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="1"
            />
            <text :x="tooltipNode.x" :y="tooltipNode.y - 58" text-anchor="middle" fill="#f0f0f5" font-size="12" font-weight="600" font-family="Inter">
              {{ tooltipNode.label }}
            </text>
            <text :x="tooltipNode.x" :y="tooltipNode.y - 38" text-anchor="middle" fill="rgba(240,240,245,0.5)" font-size="10" font-family="Inter">
              {{ tooltipNode.layer_name }}
            </text>
            <text :x="tooltipNode.x" :y="tooltipNode.y - 22" text-anchor="middle" fill="rgba(240,240,245,0.3)" font-size="9" font-family="Inter">
              {{ (tooltipNode.content || '').slice(0, 40) }}…
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
import { ref, computed, onMounted, watch } from 'vue'
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
})

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

  if (graphLayout.value === 'layered') {
    // Layered layout: layers in columns, knowledge nodes around layer nodes
    const layerSpacing = 180
    const startX = 100
    
    graphLayers.value.forEach((l, li) => {
      const layerX = startX + li * layerSpacing
      const layerY = 80
      
      // Layer node
      nodes.push({
        id: 'layer_' + l.id,
        label: l.name,
        layer_name: l.name,
        layer_id: l.id,
        color: l.color,
        x: layerX,
        y: layerY,
        baseX: layerX,
        baseY: layerY,
        isLayer: true,
      })
      
      // Knowledge nodes for this layer
      const layerKnowledge = knowledge.value.filter(k => k.layer_id === l.id)
      const nodeSpacing = 80
      const totalHeight = (layerKnowledge.length - 1) * nodeSpacing
      
      layerKnowledge.forEach((k, ki) => {
        nodes.push({
          id: k.id,
          label: k.title,
          content: k.content,
          layer_id: k.layer_id,
          layer_name: l.name,
          color: l.color,
          x: layerX + (Math.random() - 0.5) * 20,
          y: 150 + ki * nodeSpacing - totalHeight / 2 + (Math.random() - 0.5) * 20,
          baseX: layerX,
          baseY: 150 + ki * nodeSpacing - totalHeight / 2,
          isLayer: false,
        })
        
        links.push({ source: 'layer_' + l.id, target: k.id, layer: l.name })
      })
    })
  } else {
    // Force-directed layout
    const allNodes = []
    
    // Add layer nodes
    graphLayers.value.forEach((l, li) => {
      allNodes.push({
        id: 'layer_' + l.id,
        label: l.name,
        layer_name: l.name,
        layer_id: l.id,
        color: l.color,
        isLayer: true,
      })
    })
    
    // Add knowledge nodes
    knowledge.value.forEach(k => {
      const layer = layerMap[k.layer_id]
      allNodes.push({
        id: k.id,
        label: k.title,
        content: k.content,
        layer_id: k.layer_id,
        layer_name: layer?.name || '',
        color: layer?.color || '#fff',
        isLayer: false,
      })
    })
    
    // Simple force-directed layout
    const width = 900
    const height = 500
    
    // Initialize positions
    allNodes.forEach((n, i) => {
      n.x = width / 2 + (Math.random() - 0.5) * 100
      n.y = height / 2 + (Math.random() - 0.5) * 100
    })
    
    // Simple force simulation (a few iterations)
    for (let iter = 0; iter < 50; iter++) {
      // Repulsion between all nodes
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const dx = allNodes[j].x - allNodes[i].x
          const dy = allNodes[j].y - allNodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 500 / (dist * dist)
          
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          
          allNodes[i].x -= fx
          allNodes[i].y -= fy
          allNodes[j].x += fx
          allNodes[j].y += fy
        }
      }
      
      // Attraction along links
      knowledge.value.forEach(k => {
        const layerNode = allNodes.find(n => n.id === 'layer_' + k.layer_id)
        const knowNode = allNodes.find(n => n.id === k.id)
        
        if (layerNode && knowNode) {
          const dx = layerNode.x - knowNode.x
          const dy = layerNode.y - knowNode.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          const force = dist * 0.01
          
          knowNode.x += (dx / dist) * force
          knowNode.y += (dy / dist) * force
        }
      })
    }
    
    // Apply positions
    allNodes.forEach(n => {
      n.baseX = n.x
      n.baseY = n.y
      nodes.push(n)
    })
    
    // Add links
    knowledge.value.forEach(k => {
      links.push({ source: 'layer_' + k.layer_id, target: k.id, layer: layerMap[k.layer_id]?.name || '' })
    })
  }
  
  graphNodes.value = nodes
  graphLinks.value = links
}

const getNodeX = (id) => graphNodes.value.find(n => n.id === id)?.x || 0
const getNodeY = (id) => graphNodes.value.find(n => n.id === id)?.y || 0

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

// Drag
const draggedNode = ref(null)
const startDrag = (node, e) => {
  if (e.button !== 0) return
  draggedNode.value = node
  e.stopPropagation()
  e.preventDefault()
}

const onGraphMouseUp = () => { 
  draggedNode.value = null 
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
