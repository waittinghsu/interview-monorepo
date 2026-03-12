<script setup lang="ts">
import { gsap } from 'gsap'

interface Props {
  size?: number
  color?: string
  value?: number
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 160,
  color: '#22d3ee',
  value: 0,
  label: '',
})

const arcRef = ref<SVGPathElement>()
const displayValue = ref(0)

const RADIUS = 60
const START_DEG = 225
const SPAN_DEG = 270
const CIRC = 2 * Math.PI * RADIUS
const ARC_LEN = (SPAN_DEG / 360) * CIRC

function toRad(deg: number) {
  return (deg - 90) * Math.PI / 180
}

const bgPath = (() => {
  const endDeg = START_DEG + SPAN_DEG
  const x1 = (RADIUS * Math.cos(toRad(START_DEG))).toFixed(3)
  const y1 = (RADIUS * Math.sin(toRad(START_DEG))).toFixed(3)
  const x2 = (RADIUS * Math.cos(toRad(endDeg))).toFixed(3)
  const y2 = (RADIUS * Math.sin(toRad(endDeg))).toFixed(3)
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 1 1 ${x2} ${y2}`
})()

// 28 ticks, every 10° across the 270° span
const ticks = Array.from({ length: 28 }, (_, i) => {
  const deg = START_DEG + i * (SPAN_DEG / 27)
  const rad = toRad(deg)
  const isMajor = i % 9 === 0
  const r1 = isMajor ? 51 : 55
  const r2 = 67
  return {
    x1: (r2 * Math.cos(rad)).toFixed(3),
    y1: (r2 * Math.sin(rad)).toFixed(3),
    x2: (r1 * Math.cos(rad)).toFixed(3),
    y2: (r1 * Math.sin(rad)).toFixed(3),
    isMajor,
  }
})

function progressOffset(val: number) {
  return ARC_LEN * (1 - Math.max(0, Math.min(100, val)) / 100)
}

const counterObj = { val: 0 }
let counterTween: ReturnType<typeof gsap.to> | null = null

function animateTo(target: number) {
  counterTween?.kill()
  const startVal = displayValue.value
  counterObj.val = startVal
  counterTween = gsap.to(counterObj, {
    val: target,
    duration: 1,
    ease: 'power2.out',
    onUpdate() {
      displayValue.value = Math.round(counterObj.val)
    },
  })
  if (arcRef.value) {
    gsap.to(arcRef.value, {
      strokeDashoffset: progressOffset(target),
      duration: 1,
      ease: 'power2.out',
    })
  }
}

onMounted(() => {
  if (arcRef.value) {
    gsap.set(arcRef.value, { strokeDashoffset: ARC_LEN })
  }
  nextTick(() => animateTo(props.value))
})

watch(() => props.value, val => animateTo(val))

onUnmounted(() => {
  counterTween?.kill()
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 160 160"
    class="cyber-gauge"
  >
    <defs>
      <filter id="glow-gauge">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g transform="translate(80, 80)">
      <!-- Background arc -->
      <path
        :d="bgPath"
        fill="none"
        stroke="#1e293b"
        stroke-width="7"
        stroke-linecap="round"
      />

      <!-- Tick marks -->
      <line
        v-for="(tick, i) in ticks"
        :key="i"
        :x1="tick.x1"
        :y1="tick.y1"
        :x2="tick.x2"
        :y2="tick.y2"
        :stroke="color"
        :stroke-width="tick.isMajor ? 2 : 1"
        :opacity="tick.isMajor ? 0.7 : 0.3"
      />

      <!-- Progress arc -->
      <path
        ref="arcRef"
        :d="bgPath"
        fill="none"
        :stroke="color"
        stroke-width="7"
        stroke-linecap="round"
        :stroke-dasharray="`${ARC_LEN} ${CIRC}`"
        filter="url(#glow-gauge)"
      />

      <!-- Center value -->
      <text
        text-anchor="middle"
        dominant-baseline="middle"
        y="-8"
        :fill="color"
        font-size="28"
        font-weight="bold"
        font-family="monospace"
      >
        {{ displayValue }}
      </text>

      <!-- % or label -->
      <text
        text-anchor="middle"
        y="18"
        :fill="color"
        font-size="11"
        font-family="monospace"
        opacity="0.6"
      >
        {{ label || '%' }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.cyber-gauge {
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.2));
}
</style>
