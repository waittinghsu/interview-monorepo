import { createHttpClient } from '@interview/shared-api'

/**
 * HTTP Client Composable
 * 提供配置好的 HTTP Client 實例
 */
export function useHttpClient() {
  const config = useRuntimeConfig()

  const httpClient = createHttpClient({
    baseURL: config.public.apiBaseUrl,
    timeout: 10000,
    headers: {},
    getToken: () => {
      if (import.meta.client) {
        return localStorage.getItem('token')
      }
      return null
    },
    onUnauthorized: () => {
      if (import.meta.client) {
        localStorage.removeItem('token')
        navigateTo('/login')
      }
    },
  })

  return httpClient
}
