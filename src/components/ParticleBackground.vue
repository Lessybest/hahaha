<template>
  <canvas ref="canvasRef" class="fixed inset-0 w-full h-full pointer-events-none" style="z-index:0;"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref(null)
let animId = null
let renderer, scene, camera, particles

const PARTICLE_COUNT = 1200

onMounted(() => {
  const canvas = canvasRef.value
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(window.innerWidth, window.innerHeight)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 60

  // Create particles
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 150
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80

    // Color: mix between cyan (#00d4ff) and purple (#7c3aed) with some dark
    const t = Math.random()
    if (t < 0.5) {
      // Cyan
      colors[i * 3] = 0.0
      colors[i * 3 + 1] = 0.83 * (0.5 + Math.random() * 0.5)
      colors[i * 3 + 2] = 1.0
    } else if (t < 0.8) {
      // Purple
      colors[i * 3] = 0.49 * (0.5 + Math.random() * 0.5)
      colors[i * 3 + 1] = 0.23 * (0.5 + Math.random() * 0.5)
      colors[i * 3 + 2] = 0.93 * (0.5 + Math.random() * 0.5)
    } else {
      // White dim
      colors[i * 3] = 0.8
      colors[i * 3 + 1] = 0.8
      colors[i * 3 + 2] = 0.85
    }

    sizes[i] = Math.random() * 2.5 + 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // Mouse tracking
  let mouseX = 0, mouseY = 0
  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouseMove)

  // Resize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)

  // Animate
  let time = 0
  const animate = () => {
    animId = requestAnimationFrame(animate)
    time += 0.0008

    // Gentle mouse parallax
    particles.rotation.y += (mouseX * 0.3 - particles.rotation.y) * 0.02
    particles.rotation.x += (mouseY * 0.2 - particles.rotation.x) * 0.02

    // Slow drift
    particles.rotation.y += 0.0003
    particles.rotation.x += 0.0001

    // Subtle size pulse
    const posArr = geometry.attributes.position.array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArr[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.005
    }
    geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }
  animate()

  // Cleanup stored refs for resize/mouse
  canvasRef.value._cleanup = () => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMouseMove)
  }
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (canvasRef.value?._cleanup) canvasRef.value._cleanup()
  renderer?.dispose()
})
</script>
