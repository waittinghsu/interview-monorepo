/**
 * Request 攔截器
 *
 * 執行順序：baseURL override → Token 注入 → Loading push → 埋點 → 加密（opt-in）
 *
 * _meta 支援的選項：
 *   baseURL      - 覆蓋此請求的 baseURL（用於 mock server 切換，優先度最高）
 *   useYApiMock  - 使用 YAPI mock（true/false，優先度低於 baseURL）
 *   skipLoading  - 不加入 loading queue
 *   silentError  - 不觸發 error callback
 *   rawResponse  - 不做 business code 解包，直接回傳原始 data
 *   encrypt      - 對此請求啟用加密（需搭配 encryptRequest callback）
 *   decrypt      - 對此回應啟用解密（需搭配 decryptResponse callback）
 *
 * @param {object} options
 * @param {function} [options.getToken]
 * @param {function} [options.onRequestStart]  - loading push，可在此 callback 內修改 config（如 useMock）
 * @param {function} [options.onTrackRequest]
 * @param {function} [options.encryptRequest]
 */
export function createRequestInterceptor({
  getToken,
  onRequestStart,
  onTrackRequest,
  encryptRequest,
} = {}) {
  return (config) => {
    // 1. baseURL override（_meta.baseURL 覆蓋此次請求的 base）
    if (config._meta?.baseURL) {
      config.baseURL = config._meta.baseURL
    }

    // 2. Token 注入
    if (getToken) {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // 3. Loading push + 外部 hook（可在 callback 內進一步修改 config，如 useMock）
    if (!config._meta?.skipLoading && typeof onRequestStart === 'function') {
      onRequestStart(config)
    }

    // 4. 埋點 hook
    if (typeof onTrackRequest === 'function') {
      onTrackRequest({
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      })
    }

    // 5. 加密（需 _meta.encrypt = true 且 encryptRequest 已定義）
    if (config._meta?.encrypt && typeof encryptRequest === 'function' && config.data) {
      config.data = encryptRequest(config.data, config)
    }

    return config
  }
}

/**
 * Response 成功攔截器
 *
 * 執行順序：Loading pop → 解密（opt-in）→ 埋點 → Business code 解包
 *
 * 注意：解密必須在埋點之前，確保埋點系統收到的是明文資料
 *
 * Business code 解包規則（responseFormat.enabled = true 時）：
 *   成功：取出 data[dataKey]（如 data.data 或 data.result）
 *   失敗：code !== successCode → 呼叫 onBusinessError，throw error
 *   可透過 _meta.rawResponse = true 跳過解包，回傳完整 response.data
 *
 * Business Error 處理策略：
 *   市場常見：HTTP 200 但 business code 非成功（如 code: '401'）
 *   建議：在 onBusinessError 中根據 code 觸發對應的錯誤處理
 *   例如：code '401' → 清除 token、code '403' → 權限提示
 *
 * 注意：外部 API（如 stock、third-party）若回應格式不同，
 *       應明確設置 responseFormat.enabled = false
 *
 * @param {object} options
 * @param {function} [options.onRequestEnd]
 * @param {function} [options.onTrackResponse]
 * @param {function} [options.decryptResponse]
 * @param {object}  [options.responseFormat]
 * @param {boolean} [options.responseFormat.enabled=false]
 * @param {string}  [options.responseFormat.codeKey='code']
 * @param {string}  [options.responseFormat.successCode='200']
 * @param {string}  [options.responseFormat.dataKey='data']
 * @param {string}  [options.responseFormat.msgKey='msg']
 * @param {function}[options.responseFormat.onBusinessError]  - (code, msg, response) => void
 */
export function createResponseInterceptor({
  onRequestEnd,
  onTrackResponse,
  decryptResponse,
  responseFormat = {},
} = {}) {
  const {
    enabled: formatEnabled = false,
    codeKey = 'code',
    successCode = '200',
    dataKey = 'data',
    msgKey = 'msg',
    onBusinessError,
  } = responseFormat

  return (response) => {
    // 1. Loading pop
    if (!response.config?._meta?.skipLoading && typeof onRequestEnd === 'function') {
      onRequestEnd(response.config)
    }

    // 2. 解密（需 _meta.decrypt = true 且 decryptResponse 已定義）
    //    注意：必須在埋點之前解密，否則埋點會收到密文
    let data = response.data
    if (response.config?._meta?.decrypt && typeof decryptResponse === 'function') {
      data = decryptResponse(data, response.config)
    }

    // 3. 埋點（解密後再上報，確保埋點系統收到明文）
    if (typeof onTrackResponse === 'function') {
      onTrackResponse({
        status: response.status,
        url: response.config?.url,
        method: response.config?.method?.toUpperCase(),
        // 可選：如果需要埋點 response body，此時已是明文
        // data: data,
      })
    }

    // 4. Business code 解包
    //    跳過條件：rawResponse = true 或 responseFormat 未啟用
    const skipUnwrap = response.config?._meta?.rawResponse || !formatEnabled
    if (skipUnwrap) {
      return data
    }

    const code = data?.[codeKey]
    const msg = data?.[msgKey]

    if (String(code) !== String(successCode)) {
      // Business error：code 存在但不是成功碼
      if (typeof onBusinessError === 'function') {
        onBusinessError(code, msg, response)
      }
      const err = new Error(msg || `Business error: ${code}`)
      err.code = code
      err.response = response
      return Promise.reject(err)
    }

    // 成功：取出 data[dataKey]
    return data?.[dataKey] ?? data
  }
}

/**
 * Response 錯誤攔截器
 *
 * 執行順序：Loading pop → 狀態碼分流（受 silentError 控制）
 *
 * @param {object} options
 * @param {function} [options.onRequestEnd]
 * @param {function} [options.onUnauthorized]
 * @param {function} [options.onForbidden]
 * @param {function} [options.onBadRequest]
 * @param {function} [options.onServerError]
 * @param {function} [options.onNetworkError]
 */
export function createResponseErrorInterceptor({
  onRequestEnd,
  onUnauthorized,
  onForbidden,
  onBadRequest,
  onServerError,
  onNetworkError,
} = {}) {
  return (error) => {
    const { response, config } = error

    // 1. Loading pop（無論成功失敗都要 pop）
    if (!config?._meta?.skipLoading && typeof onRequestEnd === 'function') {
      onRequestEnd(config)
    }

    const silent = config?._meta?.silentError ?? false

    if (response) {
      switch (response.status) {
        case 400:
          if (!silent) onBadRequest?.(response)
          break
        case 401:
          if (!silent) onUnauthorized?.()
          break
        case 403:
          if (!silent) onForbidden?.(response)
          break
        case 500:
          if (!silent) onServerError?.(response)
          break
        default:
          if (!silent) {
            console.error(`[HTTP] ${response.status}`, config?.url)
          }
      }
    }
    else {
      if (!silent) onNetworkError?.(error)
    }

    return Promise.reject(error)
  }
}
