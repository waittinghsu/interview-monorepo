import type { UserInfo } from '../schemas/user.schema'
import { userInfoResponseSchema } from '../schemas/user.schema'

/**
 * User Service
 * 封裝所有會員相關的 API 調用
 */
export function useUserService() {
  const api = useApiClient()

  return {
    /**
     * 取得會員資料
     */
    async getUserInfo(): Promise<UserInfo> {
      const response = await api('/userinfo', {
        method: 'GET',
      })

      // 使用 Zod 驗證並轉換
      const validated = userInfoResponseSchema.parse(response)

      if (validated.code !== 200) {
        throw new Error(validated.message || '取得會員資料失敗')
      }

      return validated.data
    },

    /**
     * 更新會員資料（範例）
     */
    async updateUserInfo(data: Partial<UserInfo>): Promise<UserInfo> {
      const response = await api('/userinfo', {
        method: 'PUT',
        body: data,
      })

      const validated = userInfoResponseSchema.parse(response)

      if (validated.code !== 200) {
        throw new Error(validated.message || '更新會員資料失敗')
      }

      return validated.data
    },
  }
}
