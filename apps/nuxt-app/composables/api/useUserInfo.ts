import type { ApiResponse, UserInfo } from '~/types/api'

/**
 * 會員資料 API Composable
 * 使用 Nuxt 原生 $fetch
 */
export function useUserInfo() {
  /**
   * 取得會員資料
   */
  const getUserInfo = async () => {
    try {
      const response = await $fetch<ApiResponse<UserInfo>>('/api/userinfo', {
        method: 'GET',
      })

      if (response.code === 200) {
        return response.data
      }

      throw new Error(response.message || '取得會員資料失敗')
    }
    catch (error) {
      console.error('取得會員資料錯誤:', error)
      throw error
    }
  }

  return {
    getUserInfo,
  }
}

/**
 * 使用 useFetch 的版本（支援 SSR）
 */
export function useFetchUserInfo() {
  return useFetch<ApiResponse<UserInfo>>('/api/userinfo', {
    method: 'GET',
    // 可以添加其他選項
    lazy: false, // 是否延遲載入
    server: true, // 是否在服務端執行
    // transform: (response) => response.data, // 可以直接轉換數據
  })
}

/**
 * 使用 useAsyncData 的版本（更靈活）
 */
export function useAsyncUserInfo() {
  return useAsyncData('userInfo', async () => {
    const response = await $fetch<ApiResponse<UserInfo>>('/api/userinfo')

    if (response.code === 200) {
      return response.data
    }

    throw new Error(response.message || '取得會員資料失敗')
  })
}
