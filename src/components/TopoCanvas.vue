<template>
  <div class="topo-canvas-wrapper" ref="wrapperRef">
    <svg :viewBox="viewBox" class="w-full h-full" :style="{ minHeight: svgMinHeight }" ref="svgRef">
      <!-- Definitions -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#00d4ff" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="glow-strong">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Connections (lines) -->
      <g v-for="conn in connections" :key="conn.from + '-' + conn.to">
        <line
          :x1="getNodeX(conn.from)"
          :y1="getNodeY(conn.from)"
          :x2="getNodeX(conn.to)"
          :y2="getNodeY(conn.to)"
          :stroke="isActiveConnection(conn) ? (conn.color || '#00d4ff') : '#333'"
          :stroke-width="isActiveConnection(conn) ? 3 : 1.5"
          :stroke-dasharray="isActiveConnection(conn) ? '8 4' : 'none'"
          :stroke-opacity="isActiveConnection(conn) ? 1 : 0.4"
          :marker-end="isActiveConnection(conn) ? 'url(#arrowhead-active)' : 'url(#arrowhead)'"
          class="transition-all duration-500"
        />
        <!-- Connection label -->
        <text
          :x="(getNodeX(conn.from) + getNodeX(conn.to)) / 2"
          :y="(getNodeY(conn.from) + getNodeY(conn.to)) / 2 - 10"
          text-anchor="middle"
          class="text-[10px] select-none"
          :fill="isActiveConnection(conn) ? (conn.color || '#00d4ff') : '#666'"
          :class="{ 'font-semibold': isActiveConnection(conn) }"
        >{{ conn.label }}</text>

        <!-- Animated packet on active connection -->
        <g v-if="isActiveConnection(conn) && showPacket && currentStepData">
          <circle
            :cx="packetPos.x"
            :cy="packetPos.y"
            r="6"
            :fill="currentStepData.packetColor || '#00d4ff'"
            filter="url(#glow-strong)"
          >
            <animate
              attributeName="r"
              values="4;8;4"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <!-- Packet label with dynamic width -->
          <rect
            :x="packetPos.x + 10"
            :y="packetPos.y - 12"
            :width="packetLabelWidth"
            height="22"
            rx="4"
            :fill="currentStepData.packetColor || '#00d4ff'"
            opacity="0.9"
          />
          <text
            :x="packetPos.x + 10 + packetLabelWidth / 2"
            :y="packetPos.y + 2"
            text-anchor="middle"
            class="text-[10px] fill-white font-medium"
          >{{ currentStepData.packetLabel || '' }}</text>
        </g>

        <!-- Broadcast visual: radiating rings from source node -->
        <g v-if="isActiveConnection(conn) && currentStepData && currentStepData.broadcast && showPacket">
          <circle
            :cx="getNodeX(conn.from)"
            :cy="getNodeY(conn.from)"
            r="20"
            fill="none"
            :stroke="currentStepData.packetColor || '#f59e0b'"
            stroke-width="2"
            opacity="0.6"
          >
            <animate attributeName="r" values="20;80;20" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle
            :cx="getNodeX(conn.from)"
            :cy="getNodeY(conn.from)"
            r="20"
            fill="none"
            :stroke="currentStepData.packetColor || '#f59e0b'"
            stroke-width="1.5"
            opacity="0.4"
          >
            <animate attributeName="r" values="20;100;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
        </g>
      </g>

      <!-- Nodes -->
      <g v-for="node in nodes" :key="node.id"
        :transform="`translate(${node.x}, ${node.y})`"
        class="cursor-pointer transition-all duration-300"
        :class="{ 'scale-110': isHighlighted(node.id) }"
      >
        <!-- Node glow effect when highlighted -->
        <circle
          v-if="isHighlighted(node.id)"
          r="42"
          fill="none"
          :stroke="currentStepData?.packetColor || '#00d4ff'"
          stroke-width="2"
          opacity="0.4"
        >
          <animate attributeName="r" values="38;48;38" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>

        <!-- Node background circle -->
        <circle
          r="32"
          :fill="isHighlighted(node.id) ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)'"
          :stroke="isHighlighted(node.id)
            ? (currentStepData?.packetColor || '#00d4ff')
            : 'rgba(255,255,255,0.15)'"
          :stroke-width="isHighlighted(node.id) ? 2.5 : 1"
          class="transition-all duration-300"
        />

        <!-- Node icon -->
        <g v-if="node.icon === 'desktop'" transform="translate(-14, -12)">
          <rect x="0" y="0" width="28" height="20" rx="2" :fill="isHighlighted(node.id) ? '#00d4ff' : '#888'" opacity="0.8"/>
          <rect x="3" y="3" width="22" height="13" rx="1" fill="#111"/>
          <line x1="14" y1="20" x2="14" y2="25" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="2"/>
          <line x1="6" y1="25" x2="22" y2="25" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="2"/>
        </g>
        <g v-else-if="node.icon === 'server'" transform="translate(-14, -16)">
          <rect x="0" y="0" width="28" height="24" rx="3" :fill="isHighlighted(node.id) ? '#00d4ff' : '#888'" opacity="0.8"/>
          <rect x="3" y="4" width="22" height="3" rx="1" fill="#111"/>
          <rect x="3" y="10" width="22" height="3" rx="1" fill="#111"/>
          <rect x="3" y="16" width="22" height="3" rx="1" fill="#111"/>
          <circle cx="21" cy="5.5" r="1" :fill="isHighlighted(node.id) ? '#0f0' : '#4a4'"/>
          <circle cx="21" cy="11.5" r="1" :fill="isHighlighted(node.id) ? '#0f0' : '#4a4'"/>
          <circle cx="21" cy="17.5" r="1" :fill="isHighlighted(node.id) ? '#0f0' : '#4a4'"/>
        </g>
        <g v-else-if="node.icon === 'globe'" transform="translate(-14, -14)">
          <circle cx="14" cy="14" r="13" :fill="none" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="2" opacity="0.8"/>
          <ellipse cx="14" cy="14" rx="6" ry="13" :fill="none" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="1"/>
          <line x1="1" y1="14" x2="27" y2="14" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="1"/>
          <line x1="3" y1="7" x2="25" y2="7" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#444'" stroke-width="0.5"/>
          <line x1="3" y1="21" x2="25" y2="21" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#444'" stroke-width="0.5"/>
        </g>
        <g v-else-if="node.icon === 'database'" transform="translate(-14, -14)">
          <ellipse cx="14" cy="5" rx="13" ry="5" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <path d="M1 5 v18 a13 5 0 0 0 26 0 V5" :fill="isHighlighted(node.id) ? '#00d4ff20' : '#181818'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <ellipse cx="14" cy="23" rx="13" ry="5" :fill="none" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
        </g>
        <g v-else-if="node.icon === 'shield'" transform="translate(-14, -14)">
          <path d="M14 2 L26 8 v8 c0 8-5 14-12 16 C7 30 2 24 2 16 V8 Z" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <path d="M14 10 L14 20 M10 14 L14 10 L18 14" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5" fill="none"/>
        </g>
        <g v-else-if="node.icon === 'git-branch'" transform="translate(-14, -12)">
          <rect x="0" y="2" width="28" height="20" rx="3" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <line x1="6" y1="8" x2="22" y2="8" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2"/>
          <line x1="6" y1="12" x2="22" y2="12" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2" stroke-dasharray="3 2"/>
          <line x1="6" y1="16" x2="22" y2="16" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2"/>
        </g>
        <g v-else transform="translate(-14, -12)">
          <circle r="20" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <text x="0" y="4" text-anchor="middle" class="text-sm font-bold" :fill="isHighlighted(node.id) ? '#00d4ff' : '#ccc'">{{ node.label?.[0] || '?' }}</text>
        </g>

        <!-- Node label (always shown) -->
        <text
          x="0"
          y="46"
          text-anchor="middle"
          class="text-xs font-semibold"
          :fill="isHighlighted(node.id) ? (currentStepData?.packetColor || '#00d4ff') : '#ccc'"
        >{{ node.label }}</text>

        <!-- Sublabel lines (split by \n to avoid overlap) -->
        <text
          v-for="(line, li) in getSublabelLines(node.sublabel)"
          :key="node.id + '-sub-' + li"
          x="0"
          :y="60 + li * 13"
          text-anchor="middle"
          class="text-[10px]"
          :fill="isHighlighted(node.id) ? '#aaa' : '#666'"
        >{{ line }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  connections: { type: Array, default: () => [] },
  currentStep: { type: Object, default: null }
})

const svgRef = ref(null)
const wrapperRef = ref(null)
const showPacket = ref(false)
const packetProgress = ref(0)
const wrapperWidth = ref(800)

// Dynamic packet label width based on text length
const packetLabelWidth = computed(() => {
  const label = props.currentStep?.packetLabel || ''
  return Math.max(80, label.length * 8 + 16)
})

// Dynamic SVG min-height based on node positions
const svgMinHeight = computed(() => {
  if (!props.nodes.length) return '320px'
  const maxY = Math.max(...props.nodes.map(n => n.y))
  // Need space for labels below nodes
  const hasSublabel = props.nodes.some(n => n.sublabel && n.sublabel.includes('\n'))
  const bottomSpace = hasSublabel ? 90 : 70
  return Math.max(320, maxY + bottomSpace) + 'px'
})

// Auto-calculate viewBox from node positions with padding
const viewBox = computed(() => {
  if (!props.nodes.length) return '0 0 800 500'
  const xs = props.nodes.map(n => n.x)
  const ys = props.nodes.map(n => n.y)
  const padX = 80
  const padYTop = 70
  const padYBottom = 90
  const minX = Math.min(...xs) - padX
  const maxX = Math.max(...xs) + padX
  const minY = Math.min(...ys) - padYTop
  const maxY = Math.max(...ys) + padYBottom
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
})

const currentStepData = computed(() => props.currentStep)

// Split sublabel by \n into separate lines
const getSublabelLines = (sublabel) => {
  if (!sublabel) return []
  return sublabel.split('\n').filter(l => l.trim())
}

const isActiveConnection = (conn) => {
  if (!props.currentStep) return false
  const highlights = props.currentStep.highlightConnections || []
  return highlights.includes(`${conn.from}-${conn.to}`) || highlights.includes(`${conn.to}-${conn.from}`)
}

const isHighlighted = (nodeId) => {
  if (!props.currentStep) return false
  return (props.currentStep.highlightNodes || []).includes(nodeId)
}

const getNodeX = (nodeId) => {
  const node = props.nodes.find(n => n.id === nodeId)
  return node ? node.x : 0
}

const getNodeY = (nodeId) => {
  const node = props.nodes.find(n => n.id === nodeId)
  return node ? node.y : 0
}

// Animated packet position along the active connection
const packetPos = computed(() => {
  if (!props.currentStep || !showPacket.value) return { x: 0, y: 0 }
  const activeConn = props.connections.find(c => isActiveConnection(c))
  if (!activeConn) return { x: 0, y: 0 }

  const fromNode = props.nodes.find(n => n.id === activeConn.from)
  const toNode = props.nodes.find(n => n.id === activeConn.to)
  if (!fromNode || !toNode) return { x: 0, y: 0 }

  const t = props.currentStep.direction === 'left'
    ? 1 - packetProgress.value
    : packetProgress.value

  return {
    x: fromNode.x + (toNode.x - fromNode.x) * t,
    y: fromNode.y + (toNode.y - fromNode.y) * t
  }
})

// Animate packet when step changes
let packetAnimTimer = null

watch(() => props.currentStep, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    showPacket.value = true
    packetProgress.value = 0
    if (packetAnimTimer) clearInterval(packetAnimTimer)

    const startTime = Date.now()
    const duration = 1500
    packetAnimTimer = setInterval(() => {
      const elapsed = Date.now() - startTime
      packetProgress.value = Math.min(elapsed / duration, 1)
      if (elapsed >= duration) {
        clearInterval(packetAnimTimer)
        packetAnimTimer = null
        setTimeout(() => {
          if (props.currentStep === newVal) {
            showPacket.value = false
          }
        }, 800)
      }
    }, 16)
  } else if (!newVal) {
    showPacket.value = false
    packetProgress.value = 0
  }
}, { immediate: true })

// Track wrapper width for responsive behavior
onMounted(() => {
  if (wrapperRef.value) {
    const ro = new ResizeObserver(entries => {
      wrapperWidth.value = entries[0].contentRect.width
    })
    ro.observe(wrapperRef.value)
    onUnmounted(() => ro.disconnect())
  }
})
</script>

<style scoped>
.topo-canvas-wrapper {
  width: 100%;
  min-height: 320px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.15);
  overflow: hidden;
}
</style>
