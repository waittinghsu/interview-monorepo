<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y: scrollY } = useWindowScroll()

const scrollProgress = computed(() => {
  if (!import.meta.client) return 0
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  return maxScroll > 0 ? Math.min((scrollY.value / maxScroll) * 100, 100) : 0
})

const isVisible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(scrollY, () => {
  isVisible.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    isVisible.value = false
  }, 6000)
})

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <div
    class="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden pointer-events-none"
    :style="{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease' }"
  >
    <div
      class="h-full bg-primary"
      :style="{ width: `${scrollProgress}%`, transition: 'width 0.15s ease-out' }"
    />
  </div>
</template>
