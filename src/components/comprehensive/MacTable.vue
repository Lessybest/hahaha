<template>
  <div class="glass-card p-4 fade-up stagger-6">
    <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">交换机 MAC 地址表</h4>
    <div v-if="entries.length === 0" class="text-xs text-text-muted italic">（空）</div>
    <table v-else class="w-full text-xs">
      <thead>
        <tr class="text-text-muted">
          <th class="text-left">MAC</th>
          <th class="text-left">端口</th>
          <th class="text-left">年龄</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, i) in entries"
          :key="i"
          :class="entry.new ? 'text-accent-primary font-bold' : ''"
        >
          <td class="py-0.5 font-mono text-[10px]">{{ entry.mac }}</td>
          <td class="py-0.5">{{ entry.port }}</td>
          <td class="py-0.5">{{ entry.age }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  entries: { type: Array, default: () => [] },
})
</script>
