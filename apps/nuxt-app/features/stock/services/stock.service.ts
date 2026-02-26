import type { StockParams, YahooFinanceResponse } from '../types/stock.types'
import type { RequestMeta } from '~/lib/api/createFetchClient'
import { useStockApiClient } from '~/lib/api/clients'

/**
 * Stock Service（nuxt-app 本地定義）
 *
 * 根據 CLAUDE.md 設計原則：
 * - shared-api 只包含通用工具（createHttpClient 等）
 * - 業務 service 在各 app 本地定義
 *
 * 目前使用 yapimock API（Yahoo Finance 格式）
 * - 請求：/v8/finance/chart/:symbol?range=1mo&interval=1d
 * - 回應：{ chart: { result: [...], error: null } }
 * - 直接返回原始格式，不需要解包
 */
export function useStockService() {
  const stockApiClient = useStockApiClient()

  return {
    /**
     * 獲取股票圖表資料
     * @param symbol - 股票代號（例如：0050.TW、BTC-USD）
     * @param params - 查詢參數
     * @param options - 請求選項（skipLoading、silentError 等）
     * @returns Promise<YahooFinanceResponse>
     */
    async getChart(
      symbol: string,
      params: StockParams = {},
      options: RequestMeta = {},
    ): Promise<YahooFinanceResponse> {
      // 調用 yapimock API（Yahoo Finance 格式）
      // 回傳：{ chart: { result: [...], error: null } }
      return stockApiClient(`/v8/finance/chart/${symbol}`, {
        query: {
          range: params.range || '1mo',
          interval: params.interval || '1d',
        },
        _meta: {
          useYApiMock: true, // 使用 YAPI Mock
          ...options,
        },
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
