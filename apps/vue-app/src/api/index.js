import { createHttpClient, createStockService, createUserService } from '@interview/shared-api'

// 建立 HTTP Client 實例
const httpClient = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  getToken: () => localStorage.getItem('token'),
  onUnauthorized: () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },
})

// 建立 Service 實例
export const userApi = createUserService(httpClient)
export const stockApi = createStockService()

// 導出 httpClient 供需要直接使用的場景
export { httpClient }
