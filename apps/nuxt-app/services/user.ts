import type { RequestMeta } from '~/composables/createFetchClient'
import { useBusinessApiFetchClient } from '~/composables/api/fetchClient'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  balance?: number
  level?: number
  memberId?: string
  nickname?: string
  avatarId?: string
  bookmarks?: string[]
}

/**
 * User Service（nuxt-app 本地定義）
 *
 * 根據 CLAUDE.md 設計原則：
 * - shared-api 只包含通用工具（createHttpClient 等）
 * - 業務 service 在各 app 本地定義
 */
export function createUserService() {
  const apiFetchClient = useBusinessApiFetchClient()

  return {
    /**
     * 登入
     */
    async login(credentials: LoginCredentials, options: RequestMeta = {}) {
      return apiFetchClient<LoginResponse>('/v1/api/user/login', {
        method: 'POST',
        body: credentials,
        _meta: options,
      })
    },

    /**
     * 登出
     */
    async logout(options: RequestMeta = {}) {
      return apiFetchClient('/v1/api/user/logout', {
        method: 'POST',
        _meta: options,
      })
    },

    /**
     * 獲取用戶資料
     */
    async getUserInfo(options: RequestMeta = {}) {
      return apiFetchClient<UserInfo>('/api/userinfo', {
        method: 'POST',
        _meta: options,
      })
    },

    /**
     * 更新用戶資料
     */
    async updateProfile(data: { name?: string, email?: string }, options: RequestMeta = {}) {
      return apiFetchClient('/v1/api/user/profile', {
        method: 'PUT',
        body: data,
        _meta: options,
      })
    },
  }
}

// 單例
export const userService = createUserService()
