import { defineStore } from 'pinia'

/**
 * App Store
 * 管理應用程式全局狀態
 */
export const useAppStore = defineStore('app', () => {
  // Loading 頁面是否已顯示過
  const hasSeenLoading = ref(false)

  // 標記已看過 loading
  function markLoadingSeen() {
    hasSeenLoading.value = true
  }

  // 重置狀態（用於測試）
  function resetLoadingState() {
    hasSeenLoading.value = false
  }

  return {
    hasSeenLoading,
    markLoadingSeen,
    resetLoadingState,
  }
})
