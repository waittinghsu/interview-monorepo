<script setup lang="ts">
import { gsap } from 'gsap'

interface Props {
  size?: number
  color?: string
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 150,
  color: '#22d3ee',
  progress: 75,
})

const circleRef = ref<SVGCircleElement>()
const outerRingRef = ref<SVGCircleElement>()

const radius = computed(() => props.size / 2 - 20)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDashoffset = computed(() => {
  return circumference.value - (props.progress / 100) * circumference.value
})

onMounted(() => {
  // 外圈旋轉動畫
  if (outerRingRef.value) {
    gsap.to(outerRingRef.value, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: 'linear',
      transformOrigin: 'center center',
    })
  }

  // 進度條初始動畫
  if (circleRef.value) {
    gsap.from(circleRef.value, {
      strokeDashoffset: circumference.value,
      duration: 2,
      ease: 'power2.out',
    })
  }
})

// 監聽 progress 變化，動態更新動畫
watch(() => props.progress, (newProgress) => {
  if (circleRef.value) {
    const newOffset = circumference.value - (newProgress / 100) * circumference.value
    gsap.to(circleRef.value, {
      strokeDashoffset: newOffset,
      duration: 0.5,
      ease: 'power2.out',
    })
  }
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="cyber-circle"
  >
    <defs>
      <filter id="glow-circle">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g :transform="`translate(${size / 2}, ${size / 2})`">
      <!-- 背景圓 -->
      <circle
        :r="radius"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        opacity="0.1"
        class="text-textMuted"
      />

      <!-- 外圈裝飾（旋轉） -->
      <g ref="outerRingRef">
        <circle
          :r="radius + 10"
          fill="none"
          :stroke="color"
          stroke-width="1"
          stroke-dasharray="5 10"
          opacity="0.4"
        />
      </g>

      <!-- 進度圓 -->
      <circle
        ref="circleRef"
        :r="radius"
        fill="none"
        :stroke="color"
        stroke-width="4"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
        transform="rotate(-90)"
        filter="url(#glow-circle)"
      />

      <!-- 中心文字 -->
      <text
        text-anchor="middle"
        dy="0.3em"
        :fill="color"
        class="text-2xl font-bold"
      >
        {{ progress }}%
      </text>

      <!-- 中心點 -->
      <circle
        r="3"
        :fill="color"
        opacity="0.6"
      />
    </g>
  </svg>
</template>

<style scoped>
.cyber-circle {
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.2));
}
</style>
