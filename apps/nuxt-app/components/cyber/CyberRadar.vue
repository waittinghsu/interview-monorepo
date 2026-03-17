<script setup lang="ts">
import { gsap } from 'gsap'

interface Props {
  size?: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  size: 200,
  color: '#22d3ee',
})

const uid = useId()
const radarRef = ref<SVGGElement>()
const scanLineRef = ref<SVGLineElement>()

let scanTween: ReturnType<typeof gsap.to> | null = null
let pulseTween: ReturnType<typeof gsap.to> | null = null

onMounted(() => {
  if (scanLineRef.value) {
    // 雷達掃描線旋轉動畫
    scanTween = gsap.to(scanLineRef.value, {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'linear',
      transformOrigin: 'center center',
    })
  }

  if (radarRef.value) {
    // 雷達圓環脈衝動畫
    pulseTween = gsap.to(radarRef.value.querySelectorAll('.pulse-ring'), {
      scale: 1.2,
      opacity: 0,
      duration: 2,
      repeat: -1,
      stagger: 0.5,
      ease: 'power1.out',
      transformOrigin: 'center center',
    })
  }
})

onUnmounted(() => {
  scanTween?.kill()
  pulseTween?.kill()
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="cyber-radar"
  >
    <defs>
      <!-- 發光效果 -->
      <filter :id="`glow-${uid}`">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- 漸層 -->
      <radialGradient :id="`radarGradient-${uid}`">
        <stop offset="0%" :stop-color="color" stop-opacity="0.3" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </radialGradient>
    </defs>

    <g ref="radarRef" :transform="`translate(${size / 2}, ${size / 2})`">
      <!-- 背景圓 -->
      <circle
        r="90"
        :fill="`url(#radarGradient-${uid})`"
        opacity="0.1"
      />

      <!-- 同心圓 -->
      <circle
        v-for="r in [30, 50, 70, 90]"
        :key="r"
        :r="r"
        fill="none"
        :stroke="color"
        stroke-width="1.5"
        opacity="0.5"
      />

      <!-- 脈衝圓環 -->
      <circle
        v-for="i in 3"
        :key="`pulse-${i}`"
        class="pulse-ring"
        r="90"
        fill="none"
        :stroke="color"
        stroke-width="2"
      />

      <!-- 刻度線 -->
      <g v-for="angle in 12" :key="angle" :transform="`rotate(${angle * 30})`">
        <line
          x1="0"
          y1="-95"
          x2="0"
          y2="-85"
          :stroke="color"
          stroke-width="2"
          opacity="0.6"
        />
      </g>

      <!-- 十字線 -->
      <line x1="-95" y1="0" x2="95" y2="0" :stroke="color" stroke-width="1" opacity="0.3" />
      <line x1="0" y1="-95" x2="0" y2="95" :stroke="color" stroke-width="1" opacity="0.3" />

      <!-- 掃描線 -->
      <g ref="scanLineRef">
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-90"
          :stroke="color"
          stroke-width="2"
          :filter="`url(#glow-${uid})`"
          opacity="0.8"
        />
        <!-- 掃描區域 -->
        <path
          d="M 0,0 L 0,-90 A 90,90 0 0,1 77.9,-45 Z"
          :fill="color"
          opacity="0.1"
        />
      </g>

      <!-- 中心點 -->
      <circle
        r="4"
        :fill="color"
        :filter="`url(#glow-${uid})`"
      />

      <!-- 隨機目標點（模擬雷達偵測） -->
      <circle
        v-for="i in 5"
        :key="`target-${i}`"
        :cx="Math.cos(i * 1.2) * (40 + i * 10)"
        :cy="Math.sin(i * 1.2) * (40 + i * 10)"
        r="3"
        :fill="color"
        opacity="0.8"
      >
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          :dur="`${2 + i * 0.3}s`"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
</template>

<style scoped>
.cyber-radar {
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.3));
}
</style>
