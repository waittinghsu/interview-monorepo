import { createFetchClient, type ExtendedFetchOptions } from '~/composables/createFetchClient'

/**
 * Business API Client（User 系列，使用 yapimock）
 * 回傳格式：{ code: '200', data: {...}, msg: 'OK' }
 */
export function createBusinessApiFetchClient() {
  return createFetchClient({
    baseURL: '/api',
    timeout: 10000,
    getToken: () => {
      const { getToken } = useAppToken()
      return getToken()
    },

    responseFormat: {
      enabled: true,
      codeKey: 'code',
      successCode: '200',
      dataKey: 'data',
      msgKey: 'msg',
      onBusinessError: (code, msg) => {
        const { clearToken } = useAppToken()
        const { showError } = useApiNotification()

        if (code === '401') {
          clearToken()
          navigateTo('/login')
        }
        else {
          showError(msg || '操作失敗')
        }
      },
    },

    onRequestStart: (context) => {
      const meta = (context.options as ExtendedFetchOptions)?._meta

      // Mock 機制（目前固定使用 yapimock）
      if (import.meta.env.VITE_USE_YAPI_MOCK === 'true') {
        context.options.baseURL = import.meta.env.VITE_YAPI_BASE_URL
      }

      // Per-request baseURL override
      if (meta?.baseURL) {
        context.options.baseURL = meta.baseURL
      }

      if (!meta?.skipLoading) {
        const loadingStore = useApiLoadingStore()
        loadingStore.increment()
      }
    },

    onRequestEnd: () => {
      const loadingStore = useApiLoadingStore()
      loadingStore.decrement()
    },

    onUnauthorized: () => {
      const { clearToken } = useAppToken()
      const { showError } = useApiNotification()

      clearToken()
      showError('登入已過期，請重新登入')
      navigateTo('/login')
    },

    onForbidden: () => {
      const { showError } = useApiNotification()
      showError('無權限訪問')
    },

    onBadRequest: () => {
      const { showError } = useApiNotification()
      showError('請求參數錯誤')
    },

    onServerError: () => {
      const { showError } = useApiNotification()
      showError('伺服器錯誤')
    },

    onNetworkError: () => {
      const { showError } = useApiNotification()
      showError('網路錯誤，請檢查連線')
    },

    onTrackRequest: ({ method, url }) => {
      if (import.meta.dev) {
        console.log('[Track] →', method, url)
      }
      // TODO: 實際埋點實作
    },

    onTrackResponse: ({ status, method, url }) => {
      if (import.meta.dev) {
        console.log('[Track] ←', status, method, url)
      }
      // TODO: 實際埋點實作
    },

    // 預留加解密功能
    encryptRequest: (data, context) => {
      // TODO: 加密實作
      return data
    },

    decryptResponse: (data, context) => {
      // TODO: 解密實作
      return data
    },
  })
}

/**
 * Stock API Client（Yahoo Finance 格式，使用 yapimock）
 * 回傳格式：{ chart: { result: [...], error: null } }
 * 不需要 Business Response Format 解包
 */
export function createStockApiFetchClient() {
  return createFetchClient({
    baseURL: '/v8/finance',
    timeout: 10000,
    getToken: () => null, // Stock API 不需要 token

    responseFormat: {
      enabled: false, // ❌ 不啟用 Business Response Format 解包
      codeKey: 'code',
      successCode: '200',
      dataKey: 'data',
      msgKey: 'msg',
    },

    onRequestStart: (context) => {
      const meta = (context.options as ExtendedFetchOptions)?._meta

      // Mock 機制（目前固定使用 yapimock）
      if (import.meta.env.VITE_USE_YAPI_MOCK === 'true') {
        context.options.baseURL = import.meta.env.VITE_YAPI_BASE_URL
      }

      // Per-request baseURL override
      if (meta?.baseURL) {
        context.options.baseURL = meta.baseURL
      }

      if (!meta?.skipLoading) {
        const loadingStore = useApiLoadingStore()
        loadingStore.increment()
      }
    },

    onRequestEnd: () => {
      const loadingStore = useApiLoadingStore()
      loadingStore.decrement()
    },

    onUnauthorized: () => {
      // Stock API 不需要處理 401
    },

    onForbidden: () => {
      const { showError } = useApiNotification()
      showError('無權限訪問')
    },

    onBadRequest: () => {
      const { showError } = useApiNotification()
      showError('請求參數錯誤')
    },

    onServerError: () => {
      const { showError } = useApiNotification()
      showError('伺服器錯誤')
    },

    onNetworkError: () => {
      const { showError } = useApiNotification()
      showError('網路錯誤，請檢查連線')
    },

    onTrackRequest: ({ method, url }) => {
      if (import.meta.dev) {
        console.log('[Track] →', method, url)
      }
    },

    onTrackResponse: ({ status, method, url }) => {
      if (import.meta.dev) {
        console.log('[Track] ←', status, method, url)
      }
    },
  })
}

// 單例（延遲初始化）
let businessApiFetchClientInstance: ReturnType<typeof createFetchClient> | null = null
let stockApiFetchClientInstance: ReturnType<typeof createFetchClient> | null = null

export function useBusinessApiFetchClient() {
  if (!businessApiFetchClientInstance) {
    businessApiFetchClientInstance = createBusinessApiFetchClient()
  }
  return businessApiFetchClientInstance
}

export function useStockApiFetchClient() {
  if (!stockApiFetchClientInstance) {
    stockApiFetchClientInstance = createStockApiFetchClient()
  }
  return stockApiFetchClientInstance
}

// 向後兼容（預設使用 Business API Client）
export function useApiFetchClient() {
  return useBusinessApiFetchClient()
}
