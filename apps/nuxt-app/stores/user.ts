import type { LoginCredentials, UserInfo } from '~/services/user'
import { defineStore } from 'pinia'
import { userService } from '~/services/user'

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
    try {
      const data = await userService.login(credentials)

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
    try {
      await userService.logout({ silentError: true })
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
   */
  async function fetchUserInfo() {
    try {
      const data = await userService.getUserInfo()
      user.value = data
      return data
    }
    catch (error) {
      console.error('[UserStore] Fetch user info failed:', error)
      throw error
    }
  }

  // 初始化
  if (import.meta.client) {
    initToken()
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
    fetchUserInfo,
  }
})
