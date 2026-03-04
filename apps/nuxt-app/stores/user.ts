import type { LoginCredentials, UserInfo } from '~/features/user'
import { defineStore } from 'pinia'
import { useAuthService, useUserService } from '~/features/user'

export const useUserStore = defineStore('user', () => {
  const { setToken, clearToken, getToken } = useAppToken()

  const token = ref<string>('')
  const user = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // 初始化 token（從 cookie/localStorage 讀取）
  function initToken() {
    const savedToken = getToken()
    if (savedToken) {
      token.value = savedToken
    }
  }

  /**
   * 登入
   * @param credentials - 登入憑證
   */
  async function login(credentials: LoginCredentials) {
    const authService = useAuthService()

    try {
      const data = await authService.login(credentials)

      token.value = data.token
      user.value = data.user as unknown as UserInfo
      setToken(data.token)

      return data
    }
    catch (error) {
      console.error('[UserStore] Login failed:', error)
      throw error
    }
  }

  /**
   * 登出
   */
  async function logout() {
    const authService = useAuthService()

    try {
      await authService.logout({ silentError: true })
    }
    catch (error) {
      console.error('[UserStore] Logout failed:', error)
    }
    finally {
      token.value = ''
      user.value = null
      clearToken()
    }
  }

  /**
   * 獲取使用者資訊
   * 當有 token 時調用此方法取得完整的 user 資料
   */
  async function fetchUserInfo() {
    const { getUserInfo } = useUserService()

    try {
      const userInfo = await getUserInfo()
      user.value = userInfo
      return userInfo
    }
    catch (error) {
      console.error('[UserStore] Fetch user info failed:', error)
      // 如果獲取失敗（token 過期等），清除 token
      clearToken()
      token.value = ''
      user.value = null
      throw error
    }
  }

  /**
   * 初始化認證狀態
   * 在 app 啟動時調用，如果有 token 就自動獲取 user info
   */
  async function initializeAuth() {
    initToken()

    if (token.value) {
      try {
        await fetchUserInfo()
      }
      catch {
        // 靜默失敗，不需要顯示錯誤（已在 fetchUserInfo 中處理）
        console.log('[UserStore] Auto-login failed, token may be expired')
      }
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
    fetchUserInfo,
    initializeAuth,
  }
})
