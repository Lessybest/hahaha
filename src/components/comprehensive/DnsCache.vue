<template>
  <div class="glass-card p-4 fade-up stagger-7">
    <h4 class="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">DNS 缓存（H1）</h4>
    <div v-if="entries.length === 0" class="text-xs text-text-muted italic">（空）</div>
    <table v-else class="w-full text-xs">
      <thead>
        <tr class="text-text-muted">
          <th class="text-left">域名</th>
          <th class="text-left">IP</th>
          <th class="text-left">TTL</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, i) in entries"
          :key="i"
          :class="entry.new ? 'text-accent-primary font-bold' : ''"
        >
          <td class="py-0.5 font-mono">{{ entry.domain }}</td>
          <td class="py-0.5 font-mono">{{ entry.ip }}</td>
          <td class="py-0.5">{{ entry.ttl }}</td>
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
