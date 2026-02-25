/**
 * SSR-safe Token 管理
 * - SSR：從 cookie 讀取
 * - CSR：從 localStorage 讀取（優先）+ cookie 同步
 */
export function useAppToken() {
  const TOKEN_KEY = 'token'
  const COOKIE_NAME = 'auth-token'

  const getToken = (): string | null => {
    if (import.meta.server) {
      // SSR：從 cookie 讀取
      const cookie = useCookie(COOKIE_NAME)
      return cookie.value || null
    }

    if (import.meta.client) {
      // CSR：優先從 localStorage 讀取
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        return token
      }

      // Fallback to cookie
      const cookie = useCookie(COOKIE_NAME)
      return cookie.value || null
    }

    return null
  }

  const setToken = (token: string) => {
    if (import.meta.client) {
      // 同時寫入 localStorage 和 cookie
      localStorage.setItem(TOKEN_KEY, token)
      const cookie = useCookie(COOKIE_NAME, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      cookie.value = token
    }

    if (import.meta.server) {
      // SSR：只寫入 cookie
      const cookie = useCookie(COOKIE_NAME, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      cookie.value = token
    }
  }

  const clearToken = () => {
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      const cookie = useCookie(COOKIE_NAME)
      cookie.value = null
    }

    if (import.meta.server) {
      const cookie = useCookie(COOKIE_NAME)
      cookie.value = null
    }
  }

  return {
    getToken,
    setToken,
    clearToken,
  }
}
