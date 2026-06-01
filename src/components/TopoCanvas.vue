<template>
  <div class="topo-canvas-wrapper">
    <svg :viewBox="viewBox" class="w-full h-full min-h-[320px]" ref="svgRef">
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
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
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
          :stroke="isActiveConnection(conn) ? conn.color || '#00d4ff' : '#333'"
          :stroke-width="isActiveConnection(conn) ? 3 : 1.5"
          :stroke-dasharray="isActiveConnection(conn) ? '8 4' : 'none'"
          :stroke-opacity="isActiveConnection(conn) ? 1 : 0.4"
          :marker-end="isActiveConnection(conn) ? 'url(#arrowhead-active)' : 'url(#arrowhead)'"
          class="transition-all duration-500"
        />
        <!-- Connection label -->
        <text
          :x="(getNodeX(conn.from) + getNodeX(conn.to)) / 2"
          :y="(getNodeY(conn.from) + getNodeY(conn.to)) / 2 - 8"
          text-anchor="middle"
          class="text-[10px] fill-text-muted select-none"
          :class="{ '!fill-accent-primary font-semibold': isActiveConnection(conn) }"
        >{{ conn.label }}</text>

        <!-- Animated packet on active connection -->
        <g v-if="isActiveConnection(conn) && showPacket">
          <circle
            :cx="packetPos.x"
            :cy="packetPos.y"
            r="6"
            :fill="currentStepData?.packetColor || '#00d4ff'"
            filter="url(#glow-strong)"
            class="animate-pulse"
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
            :y="packetPos.y - 10"
            width="120"
            height="20"
            rx="4"
            :fill="currentStepData?.packetColor || '#00d4ff'"
            opacity="0.9"
          />
          <text
            :x="packetPos.x + 70"
            :y="packetPos.y + 4"
            text-anchor="middle"
            class="text-[10px] fill-white font-medium"
          >{{ currentStepData?.packetLabel || '' }}</text>
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
          r="45"
          fill="none"
          :stroke="currentStepData?.packetColor || '#00d4ff'"
          stroke-width="2"
          opacity="0.5"
          class="animate-ping"
          style="animation-duration: 2s;"
        />

        <!-- Node background circle -->
        <circle
          r="32"
          :fill="isHighlighted(node.id)
            ? `linear-gradient(135deg, ${(currentStepData?.packetColor || '#00d4ff')}40, ${ (currentStepData?.packetColor || '#00d4ff')}15)`
            : 'rgba(255,255,255,0.05)'"
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
        <g v-else-if="node.icon === 'router'" transform="translate(-14, -12)">
          <circle cx="14" cy="12" r="13" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <line x1="4" y1="6" x2="24" y2="18" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="1.5"/>
          <line x1="24" y1="6" x2="4" y2="18" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="1.5"/>
          <circle cx="14" cy="12" r="4" :fill="isHighlighted(node.id) ? '#00d4ff50' : '#333'"/>
        </g>
        <g v-else-if="node.icon === 'switch'" transform="translate(-14, -12)">
          <rect x="0" y="2" width="28" height="20" rx="3" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <line x1="6" y1="8" x2="22" y2="8" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2"/>
          <line x1="6" y1="12" x2="22" y2="12" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2" stroke-dasharray="3 2"/>
          <line x1="6" y1="16" x2="22" y2="16" :stroke="isHighlighted(node.id) ? '#0f0' : '#4a4'" stroke-width="2"/>
          <text x="14" y="23" text-anchor="middle" class="text-[7px] fill-text-muted">S</text>
        </g>
        <g v-else-if="node.icon === 'laptop'" transform="translate(-14, -11)">
          <path d="M2 0 h24 a2 2 0 0 1 2 2 v14 a2 2 0 0 1 -2 2 H2 a2 2 0 0 1 -2 -2 V2 a2 2 0 0 1 2 -2z" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <rect x="4" y="3" width="20" height="12" rx="1" fill="#111"/>
          <path d="M-2 19 h32 l-3 4 H1 z" :fill="isHighlighted(node.id) ? '#00d4ff40' : '#333'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#666'" stroke-width="1"/>
        </g>
        <g v-else-if="node.icon === 'cloud'" transform="translate(-16, -12)">
          <path d="M16 6 A8 8 0 0 0 0 10 A6 6 0 0 0 4 22 h24 a6 6 0 0 0 2 -12 A8 8 0 0 0 16 6z" :fill="isHighlighted(node.id) ? '#00d4ff20' : '#181818'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
        </g>
        <g v-else transform="translate(-14, -12)">
          <circle r="20" :fill="isHighlighted(node.id) ? '#00d4ff30' : '#222'" :stroke="isHighlighted(node.id) ? '#00d4ff' : '#888'" stroke-width="1.5"/>
          <text x="0" y="4" text-anchor="middle" class="text-sm font-bold" :fill="isHighlighted(node.id) ? '#00d4ff' : '#ccc'">{{ node.label?.[0] || '?' }}</text>
        </g>

        <!-- Node label -->
        <text
          x="0"
          y="48"
          text-anchor="middle"
          class="text-xs font-semibold transition-colors duration-300"
          :fill="isHighlighted(node.id) ? (currentStepData?.packetColor || '#00d4ff') : '#ccc'"
        >{{ node.label }}</text>
        <text
          x="0"
          y="62"
          text-anchor="middle"
          class="text-[10px] fill-text-muted"
        >{{ node.sublabel }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  connections: {
    type: Array,
    default: () => []
  },
  currentStep: {
    type: Object,
    default: null
  }
})

const svgRef = ref(null)
const showPacket = ref(false)
const packetProgress = ref(0)

// Auto-calculate viewBox from node positions
const viewBox = computed(() => {
  if (!props.nodes.length) return '0 0 800 500'
  const xs = props.nodes.map(n => n.x)
  const ys = props.nodes.map(n => n.y)
  const minX = Math.min(...xs) - 80
  const maxX = Math.max(...xs) + 80
  const minY = Math.min(...ys) - 80
  const maxY = Math.max(...ys) + 100 // extra space for labels below
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
})

// Current step data for coloring
const currentStepData = computed(() => props.currentStep)

// Check if a connection is active (highlighted by current step)
const isActiveConnection = (conn) => {
  if (!props.currentStep) return false
  const highlights = props.currentStep.highlightConnections || []
  return highlights.includes(`${conn.from}-${conn.to}`) || highlights.includes(`${conn.to}-${conn.from}`)
}

// Check if a node is highlighted
const isHighlighted = (nodeId) => {
  if (!props.currentStep) return false
  const highlights = props.currentStep.highlightNodes || []
  return highlights.includes(nodeId)
}

// Get node X/Y position
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

  // Determine direction based on step direction
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
    // Start packet animation
    showPacket.value = true
    packetProgress.value = 0

    // Clear existing animation
    if (packetAnimTimer) clearInterval(packetAnimTimer)

    // Animate from 0 to 1 over 1500ms
    const startTime = Date.now()
    const duration = 1500
    packetAnimTimer = setInterval(() => {
      const elapsed = Date.now() - startTime
      packetProgress.value = Math.min(elapsed / duration, 1)
      if (elapsed >= duration) {
        clearInterval(packetAnimTimer)
        packetAnimTimer = null
        // Keep packet visible for a moment then fade
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
