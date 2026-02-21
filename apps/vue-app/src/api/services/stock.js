/**
 * Stock Service
 *
 * 現在接受外部傳入的 httpClient，讓呼叫端統一設定 baseURL 與攔截器。
 * （舊版使用獨立 axios instance，無法共用 loading / tracking hooks）
 *
 * 每個方法最後一個參數為 options，透過 axios config._meta 傳入攔截器。
 *
 * options 支援：
 *   { useYApiMock: true }   - 使用 YAPI mock（覆蓋全域設定）
 *   { useYApiMock: false }  - 使用真實後端（覆蓋全域設定）
 *   { baseURL: '...' }      - 覆蓋此請求的 baseURL（優先度最高）
 *   { skipLoading: true }   - 不加入 loading queue
 *   { silentError: true }   - 不觸發 error callback（靜默失敗）
 *
 * @param {import('axios').AxiosInstance} httpClient
 */
export function createStockService(httpClient) {
  return {
    /**
     * 獲取股票圖表資料
     * @param {string} symbol   - 股票代號（例如：0050.TW、BTC-USD）
     * @param {object} params
     * @param {string} [params.range]    - 時間範圍（1d / 5d / 1mo / 3mo / 6mo / 1y / 2y / 5y / max）
     * @param {string} [params.interval]  - 時間間隔（1m / 5m / 15m / 1h / 1d / 1wk / 1mo）
     * @param {object} [options]            - API 控制選項
     */
    getChart(symbol, params = {}, options = {}) {
      return httpClient.get(`/v8/finance/chart/${symbol}`, {
        params: {
          range: params.range || '1mo',
          interval: params.interval || '1d',
        },
        _meta: options,
      })
    },

    get0050(params, options = {}) {
      return this.getChart('0050.TW', params, options)
    },

    getBTC(params, options = {}) {
      return this.getChart('BTC-USD', params, options)
    },
  }
}
