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

const uid = useId()
const arcRef = ref<SVGPathElement>()
const displayValue = ref(0)

// 所有幾何值都基於 size，讓字體、線條、位置隨 size 等比縮放
const START_DEG = 225
const SPAN_DEG = 270

const radius = computed(() => props.size * 0.375) // 60 / 160
const circ = computed(() => 2 * Math.PI * radius.value)
const arcLen = computed(() => (SPAN_DEG / 360) * circ.value)
const strokeW = computed(() => props.size * 0.044) // 7 / 160
const valueFontSize = computed(() => props.size * 0.11) // 17.6 at 160
const labelFontSize = computed(() => props.size * 0.063) // 10 at 160
const valueY = computed(() => -props.size * 0.05) // -8 at 160
const labelY = computed(() => props.size * 0.113) // 18 at 160

function toRad(deg: number) {
  return (deg - 90) * Math.PI / 180
}

const bgPath = computed(() => {
  const r = radius.value
  const endDeg = START_DEG + SPAN_DEG
  const x1 = (r * Math.cos(toRad(START_DEG))).toFixed(3)
  const y1 = (r * Math.sin(toRad(START_DEG))).toFixed(3)
  const x2 = (r * Math.cos(toRad(endDeg))).toFixed(3)
  const y2 = (r * Math.sin(toRad(endDeg))).toFixed(3)
  return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`
})

const ticks = computed(() => {
  const r = radius.value
  const rOuter = r * 1.117 // 67 / 60
  const rMajor = r * 0.85 // 51 / 60
  const rMinor = r * 0.917 // 55 / 60
  return Array.from({ length: 28 }, (_, i) => {
    const deg = START_DEG + i * (SPAN_DEG / 27)
    const rad = toRad(deg)
    const isMajor = i % 9 === 0
    return {
      x1: (rOuter * Math.cos(rad)).toFixed(3),
      y1: (rOuter * Math.sin(rad)).toFixed(3),
      x2: ((isMajor ? rMajor : rMinor) * Math.cos(rad)).toFixed(3),
      y2: ((isMajor ? rMajor : rMinor) * Math.sin(rad)).toFixed(3),
      isMajor,
    }
  })
})

const tickStrokeW = computed(() => props.size * 0.0063) // 1 / 160 base

function progressOffset(val: number) {
  return arcLen.value * (1 - Math.max(0, Math.min(100, val)) / 100)
}

const counterObj = { val: 0 }
let counterTween: ReturnType<typeof gsap.to> | null = null
let arcTween: ReturnType<typeof gsap.to> | null = null

function animateTo(target: number) {
  counterTween?.kill()
  arcTween?.kill()
  counterObj.val = displayValue.value
  counterTween = gsap.to(counterObj, {
    val: target,
    duration: 1,
    ease: 'power2.out',
    onUpdate() {
      displayValue.value = Math.round(counterObj.val)
    },
  })
  if (arcRef.value) {
    arcTween = gsap.to(arcRef.value, {
      strokeDashoffset: progressOffset(target),
      duration: 1,
      ease: 'power2.out',
    })
  }
}

onMounted(() => {
  if (arcRef.value) {
    gsap.set(arcRef.value, { strokeDashoffset: arcLen.value })
  }
  nextTick(() => animateTo(props.value))
})

watch(() => props.value, val => animateTo(val))

onUnmounted(() => {
  counterTween?.kill()
  arcTween?.kill()
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="cyber-gauge"
  >
    <defs>
      <filter :id="`glow-gauge-${uid}`">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g :transform="`translate(${size / 2}, ${size / 2})`">
      <!-- Background arc -->
      <path
        :d="bgPath"
        fill="none"
        stroke="#1e293b"
        :stroke-width="strokeW"
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
        :stroke-width="tick.isMajor ? tickStrokeW * 2 : tickStrokeW"
        :opacity="tick.isMajor ? 0.7 : 0.3"
      />

      <!-- Progress arc -->
      <path
        ref="arcRef"
        :d="bgPath"
        fill="none"
        :stroke="color"
        :stroke-width="strokeW"
        stroke-linecap="round"
        :stroke-dasharray="`${arcLen} ${circ}`"
        :filter="`url(#glow-gauge-${uid})`"
      />

      <!-- Center value -->
      <text
        text-anchor="middle"
        dominant-baseline="middle"
        :y="valueY"
        :fill="color"
        :font-size="valueFontSize"
        font-weight="bold"
        font-family="monospace"
      >
        {{ displayValue }}
      </text>

      <!-- % or label -->
      <text
        text-anchor="middle"
        dominant-baseline="middle"
        :y="labelY"
        :fill="color"
        :font-size="labelFontSize"
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
