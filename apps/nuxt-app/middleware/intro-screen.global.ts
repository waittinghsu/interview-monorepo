export default defineNuxtRouteMiddleware((to) => {
  // 只在客戶端執行
  if (import.meta.client) {
    const appStore = useAppStore()

    // 🎯 只在訪問根路由 `/` 時才觸發 loading
    if (!appStore.hasSeenLoading && to.path === '/') {
      // 跳轉到 loading 頁面
      return navigateTo('/loading')
    }

    // 如果已經看過 loading 且試圖直接訪問 loading 頁面，跳轉到首頁
    if (appStore.hasSeenLoading && to.path === '/loading') {
      return navigateTo('/')
    }
  }
})
