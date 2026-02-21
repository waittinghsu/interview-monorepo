/**
 * User Service
 *
 * 每個方法最後一個參數為 options，透過 axios config._meta 傳入攔截器。
 *
 * options 支援：
 *   { useYApiMock: true }   - 使用 YAPI mock（覆蓋全域設定）
 *   { useYApiMock: false }  - 使用真實後端（覆蓋全域設定）
 *   { baseURL: '...' }      - 覆蓋此請求的 baseURL（優先度最高）
 *   { skipLoading: true }   - 不加入 loading queue
 *   { silentError: true }   - 不觸發 error callback（靜默失敗）
 *   { rawResponse: true }   - 不做 business code 解包
 *   { encrypt: true }       - 啟用請求加密
 *   { decrypt: true }       - 啟用回應解密
 *
 * @param {import('axios').AxiosInstance} httpClient
 */
export function createUserService(httpClient) {
  return {
    /**
     * 登入
     * POST /v1/api/user/login
     * @param {{ email: string, password: string }} credentials
     */
    login(credentials, options = {}) {
      return httpClient.post('/v1/api/user/login', credentials, { _meta: options })
    },

    /**
     * 登出
     * POST /v1/api/user/logout
     */
    logout(options = {}) {
      return httpClient.post('/v1/api/user/logout', {}, { _meta: options })
    },

    /**
     * 取得使用者資訊
     * GET /v1/api/user/info
     */
    getUserInfo(options = {}) {
      return httpClient.get('/v1/api/user/info', { _meta: options })
    },
  }
}
