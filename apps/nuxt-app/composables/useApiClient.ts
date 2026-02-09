/**
 * API Client Composable with Interceptors
 * 統一的 $fetch 配置，包含攔截器和 Abort 管理
 */
export function useApiClient() {
  // Abort Controller 管理 Map
  const controllerMap = new Map<string, AbortController>()

  // 創建 $fetch 實例
  const api = $fetch.create({
    baseURL: '/api',

    // Request 攔截器
    onRequest({ options, request }) {
      const key = String(request)

      // 如果同一個請求正在進行，取消前一個
      if (controllerMap.has(key)) {
        controllerMap.get(key)?.abort()
      }

      // 創建新的 AbortController
      const controller = new AbortController()
      controllerMap.set(key, controller)
      options.signal = controller.signal

      // 添加 Token (如果需要)
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        if (token) {
          options.headers = new Headers(options.headers || {})
          options.headers.set('Authorization', `Bearer ${token}`)
        }
      }

      // 開發模式下記錄請求
      if (import.meta.dev) {
        console.log(`[API Request] ${request}`, options)
      }
    },

    // Response 攔截器
    onResponse({ request, response }) {
      // 清除 controller
      controllerMap.delete(String(request))

      // 開發模式下記錄回應
      if (import.meta.dev) {
        console.log(`[API Response] ${request}`, response._data)
      }
    },

    // Error 攔截器
    onResponseError({ request, response }) {
      // 清除 controller
      controllerMap.delete(String(request))

      // 統一錯誤處理
      const status = response.status

      if (status === 401) {
        // 未授權 - 清除 token 並跳轉登入
        if (import.meta.client) {
          localStorage.removeItem('token')
          navigateTo('/login')
        }
      }
      else if (status === 403) {
        console.error('[API Error] 403 - 沒有權限')
      }
      else if (status === 404) {
        console.error('[API Error] 404 - 資源不存在')
      }
      else if (status >= 500) {
        console.error('[API Error] 500+ - 伺服器錯誤')
      }

      // 開發模式下記錄錯誤
      if (import.meta.dev) {
        console.error(`[API Error] ${request}`, {
          status,
          data: response._data,
        })
      }
    },
  })

  return api
}
