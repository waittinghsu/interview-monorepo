import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { userInfoSchema } from '~/features/user/schemas/user.schema'
import { createUserService } from '~/services/user'
import { useHttpClient } from './useHttpClient'

/**
 * User Composable - TanStack Query hooks
 * Composable 層：封裝 Service 並提供 Query hooks
 */

// Query Keys
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

/**
 * 取得用戶資料 Query
 */
export function useUserProfileQuery() {
  const httpClient = useHttpClient()
  const userService = createUserService(httpClient)

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const data = await userService.getProfile()
      return userInfoSchema.parse(data)
    },
    enabled: false, // 預設不啟用，需要登入後才啟用
  })
}

/**
 * 登入 Mutation
 */
export function useLoginMutation() {
  const httpClient = useHttpClient()
  const userService = createUserService(httpClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: { email: string, password: string }) =>
      userService.login(credentials),
    onSuccess: (data: any) => {
      // 儲存 token
      if (import.meta.client && data.token) {
        localStorage.setItem('token', data.token)
      }
      // 重新取得用戶資料
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

/**
 * 登出 Mutation
 */
export function useLogoutMutation() {
  const httpClient = useHttpClient()
  const userService = createUserService(httpClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => userService.logout(),
    onSuccess: () => {
      if (import.meta.client) {
        localStorage.removeItem('token')
      }
      // 清除快取
      queryClient.clear()
    },
  })
}

/**
 * 更新用戶資料 Mutation
 */
export function useUpdateProfileMutation() {
  const httpClient = useHttpClient()
  const userService = createUserService(httpClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name?: string, email?: string }) =>
      userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}
