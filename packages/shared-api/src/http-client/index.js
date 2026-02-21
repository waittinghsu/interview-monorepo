import axios from 'axios'
import {
  createRequestInterceptor,
  createResponseErrorInterceptor,
  createResponseInterceptor,
} from './interceptors.js'

/**
 * 建立 HTTP Client
 *
 * @param {object} options
 *
 * -- 基礎設定 --
 * @param {string}   [options.baseURL='/api']  - API 基礎 URL
 * @param {number}   [options.timeout=10000]   - 請求超時（ms）
 * @param {object}   [options.headers={}]      - 額外 headers
 *
 * -- Token --
 * @param {function} [options.getToken]        - 取得 Bearer Token 的函數
 *
 * -- Error callbacks --
 * @param {function} [options.onUnauthorized]  - 401：清 token、導向登入
 * @param {function} [options.onForbidden]     - 403：無權限
 * @param {function} [options.onBadRequest]    - 400：請求格式錯誤
 * @param {function} [options.onServerError]   - 500：伺服器錯誤
 * @param {function} [options.onNetworkError]  - 無法連線
 *
 * -- Loading callbacks --
 * @param {function} [options.onRequestStart]  - 請求開始（loading push）
 * @param {function} [options.onRequestEnd]    - 請求結束（loading pop，成功或失敗都會觸發）
 *
 * -- 埋點 hooks（stub，console 實作） --
 * @param {function} [options.onTrackRequest]  - 請求埋點，參數 { method, url, params, data }
 * @param {function} [options.onTrackResponse] - 回應埋點，參數 { status, url, method }
 *
 * -- 加解密 hooks（stub，預設 passthrough） --
 * @param {function} [options.encryptRequest]  - 加密請求 body，(data, config) => data
 * @param {function} [options.decryptResponse] - 解密回應 body，(data, config) => data
 *
 * -- Business response format --
 * @param {object}   [options.responseFormat]              - 啟用 business code 解包
 * @param {boolean}  [options.responseFormat.enabled=false]
 * @param {string}   [options.responseFormat.codeKey='code']
 * @param {string}   [options.responseFormat.successCode='200']
 * @param {string}   [options.responseFormat.dataKey='data']
 * @param {string}   [options.responseFormat.msgKey='msg']
 * @param {function} [options.responseFormat.onBusinessError] - (code, msg, response) => void
 *
 * @returns {import('axios').AxiosInstance}
 */
export function createHttpClient(options = {}) {
  const {
    baseURL = '/api',
    timeout = 10000,
    headers = {},
    // Token
    getToken,
    // Error callbacks
    onUnauthorized,
    onForbidden,
    onBadRequest,
    onServerError,
    onNetworkError,
    // Loading callbacks
    onRequestStart,
    onRequestEnd,
    // 埋點 hooks
    onTrackRequest,
    onTrackResponse,
    // 加解密 hooks
    encryptRequest,
    decryptResponse,
    // Business response format
    responseFormat,
  } = options

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  instance.interceptors.request.use(
    createRequestInterceptor({ getToken, onRequestStart, onTrackRequest, encryptRequest }),
    error => Promise.reject(error),
  )

  instance.interceptors.response.use(
    createResponseInterceptor({ onRequestEnd, onTrackResponse, decryptResponse, responseFormat }),
    createResponseErrorInterceptor({
      onRequestEnd,
      onUnauthorized,
      onForbidden,
      onBadRequest,
      onServerError,
      onNetworkError,
    }),
  )

  return instance
}

export {
  createRequestInterceptor,
  createResponseInterceptor,
  createResponseErrorInterceptor,
} from './interceptors.js'
