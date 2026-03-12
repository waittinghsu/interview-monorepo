<script setup lang="ts">
import { gsap } from 'gsap'

interface Props {
  size?: number
  color?: string
  locked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 160,
  color: '#22d3ee',
  locked: false,
})

const outerArcRef = ref<SVGGElement>()
const bracketsRef = ref<SVGGElement>()
const dotRef = ref<SVGCircleElement>()

const arcs = [
  { start: 10, end: 80 },
  { start: 100, end: 170 },
  { start: 190, end: 260 },
  { start: 280, end: 350 },
]

function arcPath(radius: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d - 90) * Math.PI / 180
  const x1 = (radius * Math.cos(toRad(startDeg))).toFixed(3)
  const y1 = (radius * Math.sin(toRad(startDeg))).toFixed(3)
  const x2 = (radius * Math.cos(toRad(endDeg))).toFixed(3)
  const y2 = (radius * Math.sin(toRad(endDeg))).toFixed(3)
  return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
}

let dotTween: ReturnType<typeof gsap.to> | null = null
let arcTween: ReturnType<typeof gsap.to> | null = null

onMounted(() => {
  if (outerArcRef.value) {
    arcTween = gsap.to(outerArcRef.value, {
      rotation: 360,
      duration: 6,
      repeat: -1,
      ease: 'linear',
      transformOrigin: 'center center',
    })
  }
  if (dotRef.value) {
    dotTween = gsap.to(dotRef.value, {
      opacity: 0.3,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })
  }
})

watch(() => props.locked, (isLocked) => {
  if (bracketsRef.value) {
    gsap.to(bracketsRef.value, {
      scale: isLocked ? 0.8 : 1,
      duration: 0.3,
      ease: 'power2.out',
      transformOrigin: 'center center',
    })
  }
  if (dotRef.value) {
    if (isLocked) {
      dotTween?.pause()
      gsap.to(dotRef.value, {
        opacity: 1,
        scale: 1.5,
        duration: 0.2,
        transformOrigin: 'center center',
      })
    }
    else {
      gsap.to(dotRef.value, {
        scale: 1,
        duration: 0.2,
        transformOrigin: 'center center',
        onComplete: () => { dotTween?.play() },
      })
    }
  }
})

onUnmounted(() => {
  arcTween?.kill()
  dotTween?.kill()
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 160 160"
    class="cyber-crosshair"
  >
    <defs>
      <filter id="glow-crosshair">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g transform="translate(80, 80)">
      <!-- Rotating outer arcs -->
      <g ref="outerArcRef">
        <path
          v-for="arc in arcs"
          :key="arc.start"
          :d="arcPath(70, arc.start, arc.end)"
          fill="none"
          :stroke="color"
          stroke-width="2.5"
          stroke-linecap="round"
          filter="url(#glow-crosshair)"
        />
      </g>

      <!-- Inner dashed ring -->
      <circle
        r="35"
        fill="none"
        :stroke="color"
        stroke-width="1"
        stroke-dasharray="4 6"
        opacity="0.3"
      />

      <!-- Crosshair lines -->
      <g :stroke="color" stroke-width="1" opacity="0.5">
        <line x1="0" y1="-18" x2="0" y2="-58" />
        <line x1="0" y1="18" x2="0" y2="58" />
        <line x1="-18" y1="0" x2="-58" y2="0" />
        <line x1="18" y1="0" x2="58" y2="0" />
      </g>

      <!-- Corner brackets -->
      <g ref="bracketsRef" :stroke="color" stroke-width="2.5" stroke-linecap="square">
        <!-- Top-left -->
        <line x1="-46" y1="-46" x2="-32" y2="-46" />
        <line x1="-46" y1="-46" x2="-46" y2="-32" />
        <!-- Top-right -->
        <line x1="46" y1="-46" x2="32" y2="-46" />
        <line x1="46" y1="-46" x2="46" y2="-32" />
        <!-- Bottom-right -->
        <line x1="46" y1="46" x2="32" y2="46" />
        <line x1="46" y1="46" x2="46" y2="32" />
        <!-- Bottom-left -->
        <line x1="-46" y1="46" x2="-32" y2="46" />
        <line x1="-46" y1="46" x2="-46" y2="32" />
      </g>

      <!-- Center dot -->
      <circle
        ref="dotRef"
        r="5"
        :fill="color"
        filter="url(#glow-crosshair)"
      />
    </g>
  </svg>
</template>

<style scoped>
.cyber-crosshair {
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.3));
}
</style>
