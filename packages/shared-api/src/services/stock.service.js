import axios from 'axios'

const YAPI_BASE_URL = 'https://yapi.zeabur.app/mock/27'

/**
 * Stock Service
 * 使用獨立的 axios 實例，因為股票 API 有不同的 baseURL
 */
export function createStockService() {
  return {
    /**
     * 獲取股票圖表資料
     * @param {string} symbol - 股票代號 (例如: 0050.TW, BTC-USD)
     * @param {object} params - 查詢參數
     * @param {string} params.range - 時間範圍 (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, max)
     * @param {string} params.interval - 時間間隔 (1m, 5m, 15m, 1h, 1d, 1wk, 1mo)
     * @returns {Promise}
     */
    getChart(symbol, params = {}) {
      return axios.get(`${YAPI_BASE_URL}/v8/finance/chart/${symbol}`, {
        params: {
          range: params.range || '1mo',
          interval: params.interval || '1d',
        },
      })
    },

    /**
     * 獲取 0050 資料
     */
    get0050(params) {
      return this.getChart('0050.TW', params)
    },

    /**
     * 獲取比特幣資料
     */
    getBTC(params) {
      return this.getChart('BTC-USD', params)
    },
  }
}