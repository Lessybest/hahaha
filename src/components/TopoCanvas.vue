<template>
  <div class="topo-canvas-wrapper" ref="wrapperRef">
    <svg
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid meet"
      class="w-full"
      :style="{ aspectRatio: aspectRatio, maxHeight: '65vh' }"
      ref="svgRef"
    >
      <!-- Definitions -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" :fill="activeMarkerColor" />
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
        <clipPath id="viewBoxClip">
          <rect x="0" y="0" :width="vbWidth" :height="vbHeight" />
        </clipPath>
      </defs>

      <!-- Background subtle grid -->
      <pattern id="grid" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
        <path :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      <!-- Connections (lines) -->
      <g v-for="conn in connections" :key="conn.from + '-' + conn.to">
        <line
          :x1="getNodeX(conn.from)"
          :y1="getNodeY(conn.from)"
          :x2="getNodeX(conn.to)"
          :y2="getNodeY(conn.to)"
          :stroke="activeLineColor(conn)"
          :stroke-width="isActiveConnection(conn) ? 2.5 : 1.5"
          :stroke-dasharray="isActiveConnection(conn) ? '8 4' : 'none'"
          :stroke-opacity="isActiveConnection(conn) ? 1 : 0.3"
          :marker-end="isActiveConnection(conn) ? 'url(#arrowhead-active)' : 'url(#arrowhead)'"
          class="transition-all duration-500"
        />
        <!-- Connection label -->
        <text
          :x="(getNodeX(conn.from) + getNodeX(conn.to)) / 2"
          :y="(getNodeY(conn.from) + getNodeY(conn.to)) / 2 - 12"
          text-anchor="middle"
          font-size="10"
          :fill="isActiveConnection(conn) ? (conn.color || '#00d4ff') : '#555'"
          :class="{ 'font-semibold': isActiveConnection(conn) }"
        >{{ conn.label }}</text>

        <!-- Animated packet on active connection -->
        <g v-if="isActiveConnection(conn) && showPacket && currentStepData && packetPos.x !== 0">
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
          <!-- Packet label -->
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
            :y="packetPos.y + 3"
            text-anchor="middle"
            fill="white"
            font-size="10"
            font-weight="500"
          >{{ currentStepData.packetLabel || '' }}</text>
        </g>

        <!-- Broadcast visual: radiating rings (clipped to viewBox) -->
        <g v-if="isActiveConnection(conn) && currentStepData && currentStepData.broadcast && showPacket && currentStepData.packetColor">
          <circle
            :cx="getNodeX(conn.from)"
            :cy="getNodeY(conn.from)"
            r="10"
            fill="none"
            :stroke="currentStepData.packetColor"
            stroke-width="2"
            opacity="0.5"
          >
            <animate attributeName="r" values="10;60;10" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle
            :cx="getNodeX(conn.from)"
            :cy="getNodeY(conn.from)"
            r="10"
            fill="none"
            :stroke="currentStepData.packetColor"
            stroke-width="1.5"
            opacity="0.3"
          >
            <animate attributeName="r" values="10;80;10" dur="2s" repeatCount="indefinite" begin="0.5s"/>
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
        </g>
      </g>

      <!-- Nodes -->
      <g v-for="node in nodes" :key="node.id"
        class="topo-node"
        :transform="`translate(${node.x}, ${node.y})`"
      >
        <!-- Node glow effect when highlighted -->
        <g v-if="isHighlighted(node.id)">
          <circle
            r="38"
            fill="none"
            :stroke="currentStepData?.packetColor || '#00d4ff'"
            stroke-width="2"
            opacity="0.3"
          >
            <animate attributeName="r" values="35;45;35" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
        </g>

        <!-- Node background circle -->
        <circle
          r="30"
          :fill="isHighlighted(node.id) ? nodeBgHighlight : nodeBgDefault"
          :stroke="isActiveNodeStroke(node.id)"
          :stroke-width="isHighlighted(node.id) ? 2.5 : 1"
          class="transition-all duration-300"
        />

        <!-- Node icon -->
        <g v-if="node.icon === 'desktop'" transform="translate(-13, -11)">
          <rect x="0" y="0" width="26" height="18" rx="2" :fill="isHighlighted(node.id) ? '#00d4ff' : '#888'" opacity="0.8"/>
          <rect x="3" y="3" width="20" height="12" rx="1" fill="#111"/>
          <line x1="13" y1="18" x2="13" y2="23" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="2"/>
          <line x1="6" y1="23" x2="20" y2="23" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="2"/>
        </g>
        <g v-else-if="node.icon === 'server'" transform="translate(-13, -14)">
          <rect x="0" y="0" width="26" height="22" rx="3" :fill="isHighlighted(node.id) ? '#00d4ff' : '#888'" opacity="0.8"/>
          <rect x="3" y="3" width="20" height="3" rx="1" fill="#111"/>
          <rect x="3" y="9" width="20" height="3" rx="1" fill="#111"/>
          <rect x="3" y="15" width="20" height="3" rx="1" fill="#111"/>
        </g>
        <g v-else-if="node.icon === 'git-branch'" transform="translate(-13, -11)">
          <rect x="0" y="2" width="26" height="18" rx="3" :fill="isHighlighted(node.id) ? nodeBgHighlight : '#222'" :stroke="isActiveNodeStroke(node.id)" stroke-width="1.5"/>
          <line x1="5" y1="7" x2="21" y2="7" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2"/>
          <line x1="5" y1="11" x2="21" y2="11" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2" stroke-dasharray="3 2"/>
          <line x1="5" y1="15" x2="21" y2="15" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2"/>
        </g>
        <g v-else transform="translate(-13, -11)">
          <circle r="18" :fill="isHighlighted(node.id) ? nodeBgHighlight : nodeBgDefault" :stroke="isActiveNodeStroke(node.id)" stroke-width="1.5"/>
          <text x="0" y="4" text-anchor="middle" font-size="14" font-weight="bold" :fill="isHighlighted(node.id) ? '#00d4ff' : '#ccc'">{{ node.label?.[0] || '?' }}</text>
        </g>

        <!-- Node label -->
        <text
          x="0"
          y="44"
          text-anchor="middle"
          font-size="11"
          font-weight="600"
          :fill="isHighlighted(node.id) ? (currentStepData?.packetColor || '#00d4ff') : '#ccc'"
        >{{ node.label }}</text>

        <!-- Sublabel lines -->
        <text
          v-for="(line, li) in getSublabelLines(node.sublabel)"
          :key="node.id + '-sub-' + li"
          x="0"
          :y="57 + li * 12"
          text-anchor="middle"
          font-size="9"
          :fill="isHighlighted(node.id) ? '#aaa' : '#555'"
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

// Colors
const nodeBgDefault = 'rgba(255,255,255,0.04)'
const nodeBgHighlight = 'rgba(0,212,255,0.08)'

// Dynamic packet label width
const packetLabelWidth = computed(() => {
  const label = props.currentStep?.packetLabel || ''
  return Math.max(80, label.length * 8 + 16)
})

// Grid spacing for background
const gridSize = 40

// Calculate viewBox bounds (with generous padding for animations)
const viewBox = computed(() => {
  if (!props.nodes.length) return '0 0 800 400'
  const xs = props.nodes.map(n => n.x)
  const ys = props.nodes.map(n => n.y)
  // Generous padding to keep broadcast rings inside viewBox
  const padX = 120
  const padYTop = 80
  const padYBottom = 110
  const minX = Math.min(...xs) - padX
  const maxX = Math.max(...xs) + padX
  const minY = Math.min(...ys) - padYTop
  const maxY = Math.max(...ys) + padYBottom
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
})

const vbWidth = computed(() => {
  if (!props.nodes.length) return 800
  const xs = props.nodes.map(n => n.x)
  return Math.max(...xs) - Math.min(...xs) + 240
})

const vbHeight = computed(() => {
  if (!props.nodes.length) return 400
  const ys = props.nodes.map(n => n.y)
  return Math.max(...ys) - Math.min(...ys) + 190
})

// Aspect ratio for responsive sizing
const aspectRatio = computed(() => {
  if (vbWidth.value === 0) return '2/1'
  return `${vbWidth.value} / ${vbHeight.value}`
})

// Marker color for active arrows
const activeMarkerColor = computed(() => {
  return props.currentStep?.packetColor || '#00d4ff'
})

// Line color helper
const activeLineColor = (conn) => {
  if (!isActiveConnection(conn)) return '#333'
  return conn.color || '#00d4ff'
}

const isActiveNodeStroke = (nodeId) => {
  if (!isHighlighted(nodeId)) return 'rgba(255,255,255,0.12)'
  return props.currentStep?.packetColor || '#00d4ff'
}

const currentStepData = computed(() => props.currentStep)

const getSublabelLines = (sublabel) => {
  if (!sublabel) return []
  return sublabel.split('\n').filter(l => l.trim())
}

const isActiveConnection = (conn) => {
  if (!props.currentStep) return false
  const highlights = props.currentStep.highlightConnections || []
  return highlights.includes(conn.from + '-' + conn.to) ||
         highlights.includes(conn.to + '-' + conn.from)
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

// Animated packet
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

// Animate packet
let packetAnimTimer = null

watch(() => props.currentStep, (newVal, oldVal) => {
  if (packetAnimTimer) {
    clearInterval(packetAnimTimer)
    packetAnimTimer = null
  }

  if (newVal) {
    showPacket.value = true
    packetProgress.value = 0

    // Only animate if there's a direction (packet movement)
    if (newVal.direction && newVal.direction !== 'none') {
      const startTime = Date.now()
      const duration = 1500
      packetAnimTimer = setInterval(() => {
        const elapsed = Date.now() - startTime
        packetProgress.value = Math.min(elapsed / duration, 1)
        if (elapsed >= duration) {
          clearInterval(packetAnimTimer)
          packetAnimTimer = null
          setTimeout(() => {
            showPacket.value = false
          }, 600)
        }
      }, 16)
    } else {
      // No movement - show briefly then hide
      setTimeout(() => {
        showPacket.value = false
      }, 1500)
    }
  } else {
    showPacket.value = false
    packetProgress.value = 0
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  if (packetAnimTimer) clearInterval(packetAnimTimer)
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
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.topo-canvas-wrapper svg {
  display: block;
}
</style>
