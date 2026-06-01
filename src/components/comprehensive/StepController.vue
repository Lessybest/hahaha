<template>
  <div class="glass-card p-4 mb-6 fade-up stagger-2">
    <div class="flex flex-wrap gap-2 items-center mb-4">
      <button class="btn-primary text-sm" @click="$emit('start')" :disabled="playing">
        <span class="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5V2z"/></svg>
          开始演示
        </span>
      </button>
      <button class="btn-secondary text-sm" @click="$emit('next')" :disabled="playing || currentIndex >= steps.length - 1">下一步</button>
      <button class="btn-secondary text-sm" @click="$emit('prev')" :disabled="playing || currentIndex <= 0">上一步</button>
      <button class="btn-ghost text-sm" @click="$emit('reset')">重置</button>
      <div class="ml-auto flex items-center gap-2 text-xs text-text-muted">
        <span>速度：</span>
        <button v-for="s in speedOptions" :key="s.value"
          class="px-2 py-1 rounded"
          :class="speed === s.value ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/10'"
          @click="$emit('update:speed', s.value)"
        >{{ s.label }}</button>
      </div>
    </div>
    <StepIndicator :steps="steps" :current-index="currentIndex" />
  </div>
</template>

<script setup>
import StepIndicator from '@/components/StepIndicator.vue'

defineProps({
  steps: { type: Array, required: true },
  currentIndex: { type: Number, required: true },
  playing: { type: Boolean, required: true },
  speed: { type: Number, required: true },
  speedOptions: { type: Array, required: true },
})

defineEmits(['start', 'next', 'prev', 'reset', 'update:speed'])
</script>
