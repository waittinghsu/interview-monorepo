/**
 * Request 攔截器
 * @param {object} options
 * @param {function} options.getToken - 取得 Token 的函數
 */
export function createRequestInterceptor({ getToken } = {}) {
  return (config) => {
    if (getToken) {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  }
}

/**
 * Response 攔截器（成功）
 */
export function createResponseInterceptor() {
  return response => response.data
}