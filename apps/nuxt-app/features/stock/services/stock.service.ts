import type { StockParams, StockChartResponse } from '../types/stock.types'
import type { RequestMeta } from '~/lib/api/createFetchClient'
import { useBusinessApiClient } from '~/lib/api/clients'

/**
 * Stock Service（nuxt-app 本地定義）
 *
 * 根據 CLAUDE.md 設計原則：
 * - shared-api 只包含通用工具（createHttpClient 等）
 * - 業務 service 在各 app 本地定義
 *
 * 使用 api-server API（業務格式）
 * - 請求：/v1/api/stock/chart/:symbol?range=1mo&interval=1d
 * - 回應：{ code: 200, msg: 'OK', data: StockChartResponse }
 * - useBusinessApiClient 自動解包 data 層
 */
export function useStockService() {
  const apiClient = useBusinessApiClient()

  return {
    /**
     * 獲取股票圖表資料
     * @param symbol - 股票代號（例如：0050.TW、BTC-USD）
     * @param params - 查詢參數
     * @param options - 請求選項（skipLoading、silentError 等）
     * @returns Promise<StockChartResponse>
     */
    async getChart(
      symbol: string,
      params: StockParams = {},
      options: RequestMeta = {},
    ): Promise<StockChartResponse> {
      return apiClient(`/v1/api/stock/chart/${symbol}`, {
        query: params,
        _meta: options,
      })
    },

    /**
     * 獲取 0050（元大台灣50）資料
     */
    get0050(params?: StockParams, options?: RequestMeta) {
      return this.getChart('0050.TW', params, options)
    },

    /**
     * 獲取 BTC（比特幣）資料
     */
    getBTC(params?: StockParams, options?: RequestMeta) {
      return this.getChart('BTC-USD', params, options)
    },
  }
}
