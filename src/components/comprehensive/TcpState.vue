<template>
  <div v-if="tcpState" class="glass-card p-4 mb-6 fade-up stagger-8">
    <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">TCP 连接状态</h4>
    <div
      class="text-sm font-mono"
      :class="tcpState === 'ESTABLISHED' ? 'text-accent-success' : 'text-text-secondary'"
    >
      {{ tcpState }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  tcpState: { type: String, default: '' },
})
</script>
