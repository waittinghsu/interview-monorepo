import type { UserInfo } from '../types/user.types'
import { z } from 'zod'
import { useBusinessApiClient } from '~/lib/api/clients'
import { userInfoSchema } from '../schemas/user.schema'

// GET /v1/api/user/info 返回的 data 部分
const userInfoDataSchema = z.object({
  token: z.string(),
  user: userInfoSchema,
})

/**
 * User Service
 * 封裝所有會員相關的 API 調用
 */
export function useUserService() {
  const api = useBusinessApiClient()

  return {
    /**
     * 取得會員資料
     * GET /v1/api/user/info
     *
     * 注意：Business API Client 會自動處理 response unwrapping
     * - responseFormat.enabled = true
     * - interceptor 已驗證 code，如果 !== 200 會拋出錯誤
     * - 這裡收到的已經是 data 部分
     */
    async getUserInfo(): Promise<UserInfo> {
      const data = await api('/v1/api/user/info', {
        method: 'GET',
        _meta: {
          useYApiMock: true, // 使用 YAPI Mock
        },
      })

      // Zod 驗證 data 部分（已經是 unwrapped）
      const validated = userInfoDataSchema.parse(data)

      // 返回 user 資料（不包含 token）
      return validated.user
    },

    /**
     * 更新會員資料
     * PUT /v1/api/user/info
     *
     * 注意：PUT 回應直接返回 user 物件（根據 Swagger）
     */
    async updateUserInfo(updateData: Partial<UserInfo>): Promise<UserInfo> {
      const data = await api('/v1/api/user/info', {
        method: 'PUT',
        body: updateData,
        _meta: {
          useYApiMock: true, // 使用 YAPI Mock
        },
      })

      // Zod 驗證（PUT 直接返回 user）
      const validated = userInfoSchema.parse(data)

      return validated
    },
  }
}
