<template>
  <div v-if="step" class="glass-card p-5 mb-6 fade-up stagger-3">
    <h3 class="text-sm font-semibold text-text-primary mb-2">
      {{ step.title }}
    </h3>
    <p class="text-xs text-text-secondary leading-relaxed mb-3">{{ step.description }}</p>
    <div class="flex items-center gap-2">
      <span class="text-xs px-2 py-1 rounded" :style="{ background: step.protocolColor + '20', color: step.protocolColor }">
        {{ step.protocol }}
      </span>
      <span v-if="step.broadcast" class="text-xs px-2 py-1 rounded bg-accent-warning/20 text-accent-warning">
        广播
      </span>
      <span v-else class="text-xs px-2 py-1 rounded bg-accent-success/20 text-accent-success">
        单播
      </span>
    </div>
  </div>

  <!-- 报文详情 -->
  <div v-if="step && step.packetDetail" class="glass-card p-5 mb-6 fade-up stagger-3">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
      {{ step.protocol }} 报文详情
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
      <div v-for="(val, key) in step.packetDetail" :key="key"
        class="flex gap-2 p-2 rounded-lg bg-white/5 border border-border-subtle"
      >
        <span class="text-text-muted shrink-0 w-28">{{ key }}：</span>
        <span class="text-text-primary font-mono break-all">{{ val }}</span>
      </div>
    </div>
  </div>

  <!-- 协议栈封装过程 -->
  <div v-if="step && step.protocolStack" class="glass-card p-5 mb-6 fade-up stagger-4">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">协议栈封装过程</h3>
    <div class="space-y-1">
      <div v-for="(layer, idx) in step.protocolStack" :key="idx"
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
</template>

<script setup>
defineProps({
  step: { type: Object, default: null },
})
</script>
