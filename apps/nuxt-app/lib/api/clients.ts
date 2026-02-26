import { createFetchClient, type ExtendedFetch, type ExtendedFetchOptions } from './createFetchClient'

/**
 * Business API Client（User 系列，使用 yapimock）
 * 回傳格式：{ code: '200', data: {...}, msg: 'OK' }
 */
function createBusinessApiClient() {
  // 計算 baseURL（支援環境變數配置）
  // API 路徑已包含完整路徑（如 /v1/api/user/login），不需要額外添加前綴
  const baseURL = import.meta.env.VITE_BASE_URL || ''

  return createFetchClient({
    baseURL,
    timeout: 10000,
    getToken: () => {
      const { getToken } = useAppToken()
      return getToken()
    },

    responseFormat: {
      enabled: true,
      codeKey: 'code',
      successCode: 200,
      dataKey: 'data',
      msgKey: 'msg',
      onBusinessError: (code, msg) => {
        const { clearToken } = useAppToken()
        const { showError } = useApiNotification()

        if (code === 401 || code === '401') {
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

      // Mock 機制（優先級順序）
      // 1. 最高優先級：meta.baseURL（完全自定義）
      if (meta?.baseURL) {
        context.options.baseURL = meta.baseURL
      }
      // 2. 次優先級：meta.useYApiMock（單一 API 強制使用 YAPI）
      else if (meta?.useYApiMock && import.meta.env.VITE_YAPI_BASE_URL) {
        context.options.baseURL = import.meta.env.VITE_YAPI_BASE_URL
      }
      // 3. 全局設定：VITE_ALL_USE_YAPI_MOCK（所有 API 使用 YAPI）
      else if (import.meta.env.VITE_ALL_USE_YAPI_MOCK === 'true' && import.meta.env.VITE_YAPI_BASE_URL) {
        context.options.baseURL = import.meta.env.VITE_YAPI_BASE_URL
      }
      // 4. 預設：使用傳入的 baseURL（/api 或 /v8/finance）

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
    encryptRequest: (data, _context) => {
      // TODO: 加密實作
      return data
    },

    decryptResponse: (data, _context) => {
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
function createStockApiClient() {
  // 計算 baseURL（支援環境變數配置）
  // API 路徑已包含完整路徑（如 /v8/finance/chart/0050.TW），不需要額外添加前綴
  const baseURL = import.meta.env.VITE_BASE_URL || ''

  return createFetchClient({
    baseURL,
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

      // Mock 機制（優先級順序）
      // 1. 最高優先級：meta.baseURL（完全自定義）
      if (meta?.baseURL) {
        context.options.baseURL = meta.baseURL
      }
      // 2. 次優先級：meta.useYApiMock（單一 API 強制使用 YAPI）
      else if (meta?.useYApiMock && import.meta.env.VITE_YAPI_BASE_URL) {
        context.options.baseURL = import.meta.env.VITE_YAPI_BASE_URL
      }
      // 3. 全局設定：VITE_ALL_USE_YAPI_MOCK（所有 API 使用 YAPI）
      else if (import.meta.env.VITE_ALL_USE_YAPI_MOCK === 'true' && import.meta.env.VITE_YAPI_BASE_URL) {
        context.options.baseURL = import.meta.env.VITE_YAPI_BASE_URL
      }
      // 4. 預設：使用傳入的 baseURL（/api 或 /v8/finance）

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
let businessApiClientInstance: ExtendedFetch | null = null
let stockApiClientInstance: ExtendedFetch | null = null

export function useBusinessApiClient(): ExtendedFetch {
  if (!businessApiClientInstance) {
    businessApiClientInstance = createBusinessApiClient()
  }
  return businessApiClientInstance
}

export function useStockApiClient(): ExtendedFetch {
  if (!stockApiClientInstance) {
    stockApiClientInstance = createStockApiClient()
  }
  return stockApiClientInstance
}
