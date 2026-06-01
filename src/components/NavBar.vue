<template>
  <nav class="glass-nav fixed top-0 left-0 right-0 z-50 h-14">
    <div class="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-accent-primary/20 border border-accent-primary/40
                    flex items-center justify-center group-hover:shadow-[0_0_12px_rgba(0,212,255,0.4)] transition-all">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3" fill="#00d4ff"/>
            <line x1="9" y1="9" x2="3" y2="5" stroke="#00d4ff" stroke-width="1.5"/>
            <line x1="9" y1="9" x2="15" y2="5" stroke="#00d4ff" stroke-width="1.5"/>
            <line x1="9" y1="9" x2="9" y2="15" stroke="#7c3aed" stroke-width="1.5"/>
          </svg>
        </div>
        <span class="font-semibold text-sm text-text-primary tracking-wide">李思绎的网络实习</span>
      </router-link>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="btn-ghost text-sm px-3 py-1.5 rounded-md"
          :class="{ '!text-accent-primary !bg-accent-primary/10': $route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden btn-ghost text-sm px-3 py-1.5"
        @click="mobileOpen = !mobileOpen"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path v-if="!mobileOpen" d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path v-else d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="dropdown">
      <div
        v-if="mobileOpen"
        class="md:hidden glass-nav border-t border-border-subtle"
      >
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="block px-6 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </router-link>
      </div>
    </transition>
  </nav>
  <!-- Spacer -->
  <div class="h-14" />
</template>

<script setup>
import { ref } from 'vue'

const mobileOpen = ref(false)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/dns', label: 'DNS协议' },
  { path: '/arp', label: 'ARP协议' },
  { path: '/comprehensive', label: '综合场景' },
  { path: '/knowledge', label: '知识体系' },
]
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
</style>
