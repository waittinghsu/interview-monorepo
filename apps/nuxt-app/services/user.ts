import type { AxiosInstance } from 'axios'

/**
 * User Service（nuxt-app 本地定義）
 *
 * 根據 CLAUDE.md 設計原則：
 * - shared-api 只包含通用工具（createHttpClient 等）
 * - 業務 service 在各 app 本地定義
 *
 * @param httpClient - Axios instance from useHttpClient()
 */
export function createUserService(httpClient: AxiosInstance) {
  return {
    /**
     * 登入
     * POST /v1/api/user/login
     */
    login(credentials: { email: string, password: string }) {
      return httpClient.post('/v1/api/user/login', credentials)
    },

    /**
     * 登出
     * POST /v1/api/user/logout
     */
    logout() {
      return httpClient.post('/v1/api/user/logout', {})
    },

    /**
     * 取得用戶資料
     * GET /v1/api/user/profile
     */
    getProfile() {
      return httpClient.get('/v1/api/user/profile')
    },

    /**
     * 更新用戶資料
     * PUT /v1/api/user/profile
     */
    updateProfile(data: { name?: string, email?: string }) {
      return httpClient.put('/v1/api/user/profile', data)
    },
  }
}