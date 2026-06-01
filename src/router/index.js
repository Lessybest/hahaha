import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/dns',
    name: 'DnsProtocol',
    component: () => import('@/views/DnsProtocol.vue')
  },
  {
    path: '/arp',
    name: 'ArpProtocol',
    component: () => import('@/views/ArpProtocol.vue')
  },
  {
    path: '/comprehensive',
    name: 'Comprehensive',
    component: () => import('@/views/Comprehensive.vue')
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('@/views/Knowledge.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
