import type { RequestMeta } from '~/lib/api/createFetchClient'
import { z } from 'zod'
import { useBusinessApiClient } from '~/lib/api/clients'
import { loginUserSchema } from '../schemas/user.schema'

export interface LoginCredentials {
  email: string
  password: string
}

// Login API 返回的 data 部分
// Business API Client 的 responseFormat.enabled = true 會自動 unwrap response
const loginDataSchema = z.object({
  token: z.string(),
  user: loginUserSchema,
})

/**
 * Auth Service（認證相關 API）
 *
 * 根據 CLAUDE.md 設計原則：
 * - shared-api 只包含通用工具（createHttpClient 等）
 * - 業務 service 在各 app 本地定義
 */
export function useAuthService() {
  const api = useBusinessApiClient()

  return {
    /**
     * 登入
     * POST /v1/api/user/login
     *
     * 注意：Business API Client 會自動處理 response unwrapping
     * - responseFormat.enabled = true
     * - interceptor 已驗證 code，如果 !== 200 會拋出錯誤
     * - 這裡收到的已經是 data 部分
     */
    async login(
      credentials: LoginCredentials,
      options: RequestMeta = {},
    ) {
      const data = await api('/v1/api/user/login', {
        method: 'POST',
        body: credentials,
        _meta: {
          useYApiMock: true, // 使用 YAPI Mock
          ...options,
        },
      })

      // Zod 驗證 data 部分（已經是 unwrapped）
      const validated = loginDataSchema.parse(data)

      return validated
    },

    /**
     * 登出
     * POST /v1/api/user/logout
     *
     * 根據 Swagger：logout 回應是空的 schema: {}
     * 使用 rawResponse: true 跳過 Business Response Format unwrapping
     * 使用 skipLoading: true 因為 logout 通常是同步操作
     */
    async logout(options: RequestMeta = {}): Promise<void> {
      await api('/v1/api/user/logout', {
        method: 'POST',
        _meta: {
          useYApiMock: true,
          rawResponse: true, // 跳過 response unwrapping
          skipLoading: true, // 不顯示 loading
          ...options,
        },
      })
    },
  }
}
