import { defineStore } from 'pinia'

export const useApiLoadingStore = defineStore('apiLoading', () => {
  const pendingCount = ref(0)
  const isLoading = computed(() => pendingCount.value > 0)

  function increment() {
    pendingCount.value++
  }

  function decrement() {
    pendingCount.value = Math.max(0, pendingCount.value - 1)
  }

  function reset() {
    pendingCount.value = 0
  }

  return {
    isLoading,
    pendingCount,
    increment,
    decrement,
    reset,
  }
})
