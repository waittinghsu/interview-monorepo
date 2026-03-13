<script setup>
const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
})

const currentIndex = ref(0)
const textEl = ref(null)
const animationKey = ref(0)

function resetAnimation() {
  animationKey.value++
}

onMounted(() => {
  const interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.messages.length
    resetAnimation()
  }, 10000)

  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <div class="flex items-center bg-sys-raised/50 border-y border-sys-border/50 py-2 overflow-hidden">
    <q-icon name="campaign" size="1rem" class="ml-3 mr-2 flex-shrink-0 text-primary" />
    <div class="flex-1 overflow-hidden mr-3">
      <span
        :key="animationKey"
        ref="textEl"
        class="inline-block whitespace-nowrap text-xs text-textSecondary marquee-text"
      >
        {{ messages[currentIndex] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}

.marquee-text {
  animation: marquee 10s linear forwards;
  will-change: transform;
}
</style>
