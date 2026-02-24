<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({
  layout: 'splash',
  title: 'Loading...',
})

const router = useRouter()
const appStore = useAppStore()
const progress = ref(0)
const logoRef = ref<HTMLDivElement>()
const titleRef = ref<HTMLHeadingElement>()

// 模擬加載進度
function startLoading() {
  const timeline = gsap.timeline()

  // 進度條動畫
  timeline.to(progress, {
    value: 100,
    duration: 4.5,
    ease: 'power1.inOut',
    onUpdate: () => {
      progress.value = Math.round(progress.value)
    },
  })

  // Logo 淡入
  if (logoRef.value) {
    timeline.from(logoRef.value, {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'back.out(1.7)',
    }, 0)
  }

  // 標題淡入
  if (titleRef.value) {
    timeline.from(titleRef.value, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.3)
  }

  // 5 秒後跳轉到首頁
  timeline.call(() => {
    // 標記已看過 loading 頁面
    appStore.markLoadingSeen()
    router.push('/')
  }, undefined, '+=0.5') // 在進度條完成後 0.5 秒跳轉
}

onMounted(() => {
  startLoading()
})
</script>

<template>
  <div class="min-h-screen flex-center flex-col bg-sys-page relative overflow-hidden">
    <!-- 背景網格效果 -->
    <div class="absolute inset-0 opacity-10">
      <div
        v-for="i in 20"
        :key="`h-${i}`"
        class="absolute w-full border-t border-textBrand"
        :style="{ top: `${i * 5}%` }"
      />
      <div
        v-for="i in 20"
        :key="`v-${i}`"
        class="absolute h-full border-l border-textBrand"
        :style="{ left: `${i * 5}%` }"
      />
    </div>

    <!-- 主要內容 -->
    <div class="relative z-10 flex-center flex-col gap-12">
      <!-- Logo 區域 -->
      <div ref="logoRef" class="flex-center flex-col gap-8">
        <!-- 雷達掃描 -->
        <CyberRadar :size="250" color="#22d3ee" />

        <!-- 標題 -->
        <h1
          ref="titleRef"
          class="text-4xl md:text-6xl font-bold text-textBrand drop-shadow-lg"
          style="text-shadow: 0 0 20px rgba(34, 211, 238, 0.5)"
        >
          CYBERPUNK STUDIO
        </h1>
      </div>

      <!-- 特效組件展示區 -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        <CyberCircle :size="120" color="#22d3ee" :progress="progress" />
        <CyberCircle :size="120" color="#f97316" :progress="85" />
        <CyberCircle :size="120" color="#a855f7" :progress="60" />
      </div>

      <!-- 進度條 -->
      <div class="w-full max-w-md mt-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-textSecondary text-sm">INITIALIZING SYSTEM</span>
          <span class="text-textBrand text-sm font-mono">{{ progress }}%</span>
        </div>
        <div class="h-1 bg-sys-raised rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-textBrand to-primary-400 transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <!-- 加載提示 -->
        <div class="flex items-center gap-2 mt-4 text-textMuted text-xs">
          <div class="flex gap-1">
            <div class="w-1 h-1 bg-textBrand rounded-full animate-pulse" />
            <div class="w-1 h-1 bg-textBrand rounded-full animate-pulse animation-delay-200" />
            <div class="w-1 h-1 bg-textBrand rounded-full animate-pulse animation-delay-400" />
          </div>
          <span>Loading assets...</span>
        </div>
      </div>
    </div>

    <!-- 版本信息 -->
    <div class="absolute bottom-8 right-8 text-textMuted text-xs font-mono">
      <div>VERSION 1.0.0</div>
      <div class="text-textBrand">
        SYSTEM ONLINE
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}
</style>
