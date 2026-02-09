import type { UserInfo } from '../schemas/user.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useUserService } from '~/features/user'

/**
 * Query Keys
 * 集中管理查詢鍵，方便快取管理
 */
export const userQueryKeys = {
  all: ['user'] as const,
  info: () => [...userQueryKeys.all, 'info'] as const,
}

/**
 * 取得會員資料 Query
 * 用於 CSR（客戶端渲染）
 */
export function useUserInfoQuery() {
  const service = useUserService()

  return useQuery({
    queryKey: userQueryKeys.info(),
    queryFn: () => service.getUserInfo(),
    staleTime: 1000 * 60 * 5, // 5 分鐘內不重新請求
    gcTime: 1000 * 60 * 10, // 10 分鐘後清除快取
  })
}

/**
 * 更新會員資料 Mutation
 */
export function useUpdateUserInfoMutation() {
  const service = useUserService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserInfo>) => service.updateUserInfo(data),
    onSuccess: () => {
      // 更新成功後，使快取失效
      queryClient.invalidateQueries({ queryKey: userQueryKeys.info() })
    },
  })
}

/**
 * 手動重新取得會員資料
 */
export function useRefetchUserInfo() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.info() })
  }
}
