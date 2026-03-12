<script setup lang="ts">
import { gsap } from 'gsap'

interface Props {
  size?: number
  color?: string
  rings?: number
}

withDefaults(defineProps<Props>(), {
  size: 160,
  color: '#22d3ee',
  rings: 3,
})

const pulseRef = ref<SVGGElement>()
let pulseTween: ReturnType<typeof gsap.to> | null = null

onMounted(() => {
  if (!pulseRef.value) return
  const ringEls = pulseRef.value.querySelectorAll('.pulse-ring')
  gsap.set(ringEls, { scale: 0.2, opacity: 0.8, transformOrigin: 'center center' })
  pulseTween = gsap.to(ringEls, {
    scale: 1,
    opacity: 0,
    duration: 2,
    repeat: -1,
    stagger: { each: 0.8, from: 'start' },
    ease: 'power1.out',
    transformOrigin: 'center center',
  })
})

onUnmounted(() => {
  pulseTween?.kill()
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 160 160"
    class="cyber-pulse"
  >
    <defs>
      <filter id="glow-pulse">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" :stop-color="color" stop-opacity="0.3" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </radialGradient>
    </defs>

    <g ref="pulseRef" transform="translate(80, 80)">
      <!-- Background glow -->
      <circle r="55" fill="url(#pulseGradient)" opacity="0.4" />

      <!-- Pulse rings -->
      <circle
        v-for="i in rings"
        :key="i"
        class="pulse-ring"
        r="55"
        fill="none"
        :stroke="color"
        stroke-width="2"
      />

      <!-- Static outer ring -->
      <circle r="55" fill="none" :stroke="color" stroke-width="1" opacity="0.1" />

      <!-- Center glow halo -->
      <circle r="18" :fill="color" opacity="0.08" filter="url(#glow-pulse)" />

      <!-- Center dot -->
      <circle r="8" :fill="color" opacity="0.9" filter="url(#glow-pulse)" />

      <!-- Inner core -->
      <circle r="4" :fill="color" />
    </g>
  </svg>
</template>

<style scoped>
.cyber-pulse {
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.3));
}
</style>
