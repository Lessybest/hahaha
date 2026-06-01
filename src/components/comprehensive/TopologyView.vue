<template>
  <div class="glass-card p-6 mb-6 fade-up stagger-1">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">网络拓扑</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      <div
        v-for="node in nodes"
        :key="node.id"
        class="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-subtle bg-white/5 text-center"
        :class="highlightNodes.includes(node.id) ? 'ring-2 ring-accent-primary/60 bg-accent-primary/10' : ''"
      >
        <div
          class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
          :style="{ borderColor: node.color, color: node.color }"
        >
          {{ node.shortLabel }}
        </div>
        <span class="text-xs font-medium text-text-primary">{{ node.label }}</span>
        <span class="text-[10px] text-text-muted font-mono">{{ node.ip }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nodes: { type: Array, required: true },
  highlightNodes: { type: Array, default: () => [] },
})
</script>
