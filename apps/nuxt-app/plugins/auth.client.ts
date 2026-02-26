/**
 * Auth Plugin (Client-side only)
 *
 * 在 app 啟動時自動執行：
 * 1. 檢查 localStorage/cookie 中是否有 token
 * 2. 如果有 token，自動調用 /v1/api/user/info 獲取使用者資料
 * 3. 如果 token 過期或無效，自動清除
 */
export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()

  // 初始化認證狀態
  // 如果有 token 會自動調用 getUserInfo
  await userStore.initializeAuth()
})
