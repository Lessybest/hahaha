<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="(step, idx) in steps"
      :key="step.id"
      @click="$emit('goto', idx)"
      class="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-medium cursor-pointer"
      :class="getStepClass(idx)"
    >
      <!-- Status icon -->
      <svg v-if="idx < currentIndex" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-else class="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
        {{ idx + 1 }}
      </span>
      <span class="hidden sm:inline">{{ step.title }}</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: { type: Array, required: true },
  currentIndex: { type: Number, default: -1 },
})

defineEmits(['goto'])

const getStepClass = (idx) => {
  if (idx < props.currentIndex) return 'bg-accent-success/15 border-accent-success/40 text-accent-success'
  if (idx === props.currentIndex) return 'bg-accent-primary/15 border-accent-primary/40 text-accent-primary animate-pulse-glow'
  return 'bg-white/5 border-border-subtle text-text-muted hover:border-border-hover hover:text-text-secondary'
}
</script>
