import { createHttpClient } from '@interview/shared-api'
import { loadingBus } from './loading.js'
import { createStockService } from './services/stock.js'
import { createUserService } from './services/user.js'

// ─────────────────────────────────────────────
// Mock 配置
// - 預設使用真實後端
// - VITE_USE_YAPI_MOCK: 全域緊急開關（後端掛掉時才開啟）
// - useYApiMock: per-API 控制（測試特定 API 的 mock 資料）
// ─────────────────────────────────────────────
const USE_YAPI_MOCK = import.meta.env.VITE_USE_YAPI_MOCK === 'true' // 預設 false
const YAPI_BASE_URL = import.meta.env.VITE_YAPI_BASE_URL || 'https://yapi-x.zeabur.app/mock/18'

// ─────────────────────────────────────────────
// Loading callbacks（連接攔截器與 loadingBus）
// ─────────────────────────────────────────────
const loadingCallbacks = {
  onRequestStart: (config) => {
    loadingBus.push()

    // Per-API mock 控制
    // 優先順序：_meta.baseURL > useYApiMock > 全域 USE_YAPI_MOCK > 預設真實後端

    // 1. 如果 _meta.baseURL 已設定，跳過（interceptor 已處理）
    if (config._meta?.baseURL) {
      return
    }

    // 2. 檢查 per-API 的 useYApiMock 選項
    const useYApiMock = config._meta?.useYApiMock

    if (useYApiMock === true) {
      // 明確要求使用 YAPI mock
      config.baseURL = YAPI_BASE_URL
    }
    else if (useYApiMock === false) {
      // 明確要求使用真實後端（不修改 baseURL）
      // 不需要做任何事
    }
    else {
      // 未設定時，檢查全域緊急開關
      // USE_YAPI_MOCK = true：後端掛掉時的全站降級
      // USE_YAPI_MOCK = false（預設）：使用真實後端
      if (USE_YAPI_MOCK) {
        config.baseURL = YAPI_BASE_URL
      }
    }
  },
  onRequestEnd: () => loadingBus.pop(),
}

// ─────────────────────────────────────────────
// Error callbacks
// ─────────────────────────────────────────────
const errorCallbacks = {
  onUnauthorized: () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },
  onForbidden: (res) => {
    console.warn('[API] 403 Forbidden:', res?.config?.url)
    // TODO: 顯示全域通知（無權限）
  },
  onBadRequest: (res) => {
    console.warn('[API] 400 Bad Request:', res?.config?.url, res?.data)
    // TODO: 顯示欄位驗證錯誤訊息
  },
  onServerError: (res) => {
    console.error('[API] 500 Server Error:', res?.config?.url)
    // TODO: 顯示全域錯誤通知
  },
  onNetworkError: (err) => {
    console.error('[API] Network Error:', err?.message)
    // TODO: 顯示「無法連線」提示
  },
}

// ─────────────────────────────────────────────
// 埋點 hooks（stub — 替換成真實 analytics SDK）
// ─────────────────────────────────────────────
const trackingCallbacks = {
  onTrackRequest: ({ method, url }) => {
    console.log('[Track] →', method, url)
    // TODO: analytics.track('api_request', { method, url })
  },
  onTrackResponse: ({ status, method, url }) => {
    console.log('[Track] ←', status, method, url)
    // TODO: analytics.track('api_response', { status, method, url })
  },
}

// ─────────────────────────────────────────────
// 加解密 stubs（空實作 — 替換成真實加解密邏輯）
// ─────────────────────────────────────────────
const cryptoCallbacks = {
  encryptRequest: (data, config) => {
    console.log('[Crypto] encryptRequest stub:', config?.url)
    // TODO: return encrypt(data)
    return data
  },
  decryptResponse: (data, config) => {
    console.log('[Crypto] decryptResponse stub:', config?.url)
    // TODO: return decrypt(data)
    return data
  },
}

// ─────────────────────────────────────────────
// Business response format
// 後端統一回傳 { code: '200', msg: 'OK', data: { ... } }
// ─────────────────────────────────────────────
const responseFormat = {
  enabled: true,
  codeKey: 'code',
  successCode: '200',
  dataKey: 'data',
  msgKey: 'msg',
  onBusinessError: (code, msg, response) => {
    const url = response?.config?.url
    console.warn('[API] Business Error:', code, msg, url)

    // 根據 business code 觸發對應的錯誤處理
    // 類似 HTTP status code 的處理邏輯
    switch (String(code)) {
      case '401':
        // 業務層未授權：清除 token，導向登入
        console.warn('[Business] 登入已過期')
        errorCallbacks.onUnauthorized?.()
        break

      case '403':
        // 業務層無權限
        console.warn('[Business] 無權限')
        errorCallbacks.onForbidden?.(response)
        break

      case '400':
        // 業務層參數錯誤
        console.warn('[Business] 參數錯誤')
        errorCallbacks.onBadRequest?.(response)
        break

      case '500':
        // 業務層伺服器錯誤
        console.warn('[Business] 伺服器錯誤')
        errorCallbacks.onServerError?.(response)
        break

      default:
        // 其他業務錯誤：顯示訊息
        console.error(`[Business] ${code}: ${msg}`)
        // TODO: 顯示全域錯誤通知（Toast/Message）
    }
  },
}

// ─────────────────────────────────────────────
// HTTP Client（統一配置）
// 注意：開發階段透過 USE_YAPI_MOCK 自動切換 baseURL
// ─────────────────────────────────────────────
const httpClient = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  getToken: () => localStorage.getItem('token'),
  responseFormat, // User API 使用 business format
  ...loadingCallbacks,
  ...errorCallbacks,
  ...trackingCallbacks,
  ...cryptoCallbacks,
})

// Stock API client（不使用 business response format）
const stockHttpClient = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  responseFormat: { enabled: false }, // Stock API 不用 business format
  ...loadingCallbacks,
  onNetworkError: errorCallbacks.onNetworkError,
  ...trackingCallbacks,
})

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────
// 預設使用真實後端，可透過以下方式切換 YAPI mock：
//   1. 全站切換：設定 VITE_USE_YAPI_MOCK=true（緊急開關）
//   2. 單一 API：userApi.login(creds, { useYApiMock: true })
export const userApi = createUserService(httpClient)
export const stockApi = createStockService(stockHttpClient)

// 供需要直接使用的場景
export { httpClient, stockHttpClient }
