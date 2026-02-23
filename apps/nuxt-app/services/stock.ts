import type { AxiosInstance } from 'axios'

/**
 * Stock Service（nuxt-app 本地定義）
 *
 * 根據 CLAUDE.md 設計原則：
 * - shared-api 只包含通用工具（createHttpClient 等）
 * - 業務 service 在各 app 本地定義
 *
 * @param httpClient - Axios instance from useHttpClient()
 */
export function createStockService(httpClient: AxiosInstance) {
  return {
    /**
     * 獲取股票圖表資料
     * @param symbol - 股票代號（例如：0050.TW、BTC-USD）
     * @param params - 查詢參數
     */
    getChart(
      symbol: string,
      params: {
        range?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
        interval?: '1m' | '5m' | '15m' | '1h' | '1d' | '1wk' | '1mo'
      } = {},
    ) {
      return httpClient.get(`/v8/finance/chart/${symbol}`, {
        params: {
          range: params.range || '1mo',
          interval: params.interval || '1d',
        },
      })
    },

    /**
     * 獲取 0050（元大台灣50）資料
     */
    get0050(params?: {
      range?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
      interval?: '1m' | '5m' | '15m' | '1h' | '1d' | '1wk' | '1mo'
    }) {
      return this.getChart('0050.TW', params)
    },

    /**
     * 獲取 BTC（比特幣）資料
     */
    getBTC(params?: {
      range?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
      interval?: '1m' | '5m' | '15m' | '1h' | '1d' | '1wk' | '1mo'
    }) {
      return this.getChart('BTC-USD', params)
    },
  }
}