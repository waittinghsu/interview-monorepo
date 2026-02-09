import axios from 'axios'
import { createRequestInterceptor, createResponseInterceptor } from './interceptors.js'

/**
 * 建立 HTTP Client
 * @param {object} options - 配置選項
 * @param {string} options.baseURL - API 基礎 URL
 * @param {number} options.timeout - 請求超時時間
 * @param {function} options.getToken - 取得 Token 的函數
 * @param {function} options.onUnauthorized - 401 錯誤時的回調
 * @param {object} options.headers - 額外的 headers
 * @returns {import('axios').AxiosInstance}
 */
export function createHttpClient(options = {}) {
  const {
    baseURL = '/api',
    timeout = 10000,
    getToken,
    onUnauthorized,
    headers = {},
  } = options

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  // 添加攔截器
  instance.interceptors.request.use(
    createRequestInterceptor({ getToken }),
    error => Promise.reject(error),
  )

  instance.interceptors.response.use(
    createResponseInterceptor(),
    createResponseErrorInterceptor({ onUnauthorized }),
  )

  return instance
}

/**
 * Response 錯誤攔截器
 */
function createResponseErrorInterceptor({ onUnauthorized }) {
  return (error) => {
    const { response } = error

    if (response) {
      switch (response.status) {
        case 401:
          onUnauthorized?.()
          break
        case 403:
          console.error('沒有權限訪問')
          break
        case 404:
          console.error('請求的資源不存在')
          break
        case 500:
          console.error('伺服器錯誤')
          break
        default:
          console.error(`請求錯誤: ${response.status}`)
      }
    }
    else {
      console.error('網路連線異常')
    }

    return Promise.reject(error)
  }
}

export { createRequestInterceptor, createResponseInterceptor } from './interceptors.js'