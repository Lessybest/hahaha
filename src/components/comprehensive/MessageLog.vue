<template>
  <div class="glass-card p-4 fade-up stagger-8">
    <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">通信日志</h4>
    <div class="space-y-1 max-h-48 overflow-y-auto">
      <div
        v-for="(msg, i) in logs"
        :key="i"
        class="text-xs p-2 rounded-lg"
        :class="msg.highlight ? 'bg-accent-primary/10 text-accent-primary' : 'bg-white/5 text-text-secondary'"
      >
        <span class="font-mono text-text-muted mr-2">[{{ msg.time }}]</span>
        {{ msg.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logs: { type: Array, default: () => [] },
})
</script>
