import type { LineChartData, StockParams } from '../types/stock.types'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useStockService } from '../services/stock.service'

/**
 * Stock Composable - TanStack Query hooks
 * Composable 層：封裝 Service 並提供 Query hooks
 *
 * 資料來源：api-server（業務格式）
 * - 回傳格式：{ timestamps: number[], prices: number[], ... }
 * - useBusinessApiClient 已解包 data 層
 */

// Query Keys
export const stockKeys = {
  all: ['stock'] as const,
  chart: (symbol: string, params?: { range?: string, interval?: string }) =>
    [...stockKeys.all, 'chart', symbol, params] as const,
}

function toLineChartData(timestamps: number[], prices: number[]): LineChartData[] {
  const seen = new Map<string, number>()
  timestamps.forEach((ts, i) => {
    const date = new Date(ts * 1000).toISOString().split('T')[0]
    const value = prices[i]
    if (value !== null && value !== undefined && value > 0)
      seen.set(date, value) // 同一天後蓋前，保留最新值
  })
  return Array.from(seen.entries()).map(([time, value]) => ({ time, value }))
}

/**
 * 取得股票圖表資料 Query
 */
export function useStockChartQuery(symbol: string, params: StockParams = {}) {
  const stockService = useStockService()

  return useQuery({
    queryKey: stockKeys.chart(symbol, params),
    queryFn: async () => {
      return await stockService.getChart(symbol, params)
    },
    // ✅ SSR 優化：只在客戶端執行
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 5, // 5分鐘內不重新獲取
  })
}

/**
 * 取得 0050 資料 Query（支援 reactive params）
 */
export function use0050Query(params: MaybeRefOrGetter<StockParams> = { range: '1mo', interval: '1d' }) {
  const stockService = useStockService()

  return useQuery({
    queryKey: computed(() => stockKeys.chart('0050.TW', toValue(params))),
    queryFn: async (): Promise<LineChartData[]> => {
      const p = toValue(params)
      const response = await stockService.get0050(p)
      return toLineChartData(response.timestamps, response.prices)
    },
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * 取得比特幣資料 Query（支援 reactive params）
 */
export function useBTCQuery(params: MaybeRefOrGetter<StockParams> = { range: '1mo', interval: '1d' }) {
  const stockService = useStockService()

  return useQuery({
    queryKey: computed(() => stockKeys.chart('BTC-USD', toValue(params))),
    queryFn: async (): Promise<LineChartData[]> => {
      const p = toValue(params)
      const response = await stockService.getBTC(p)
      return toLineChartData(response.timestamps, response.prices)
    },
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 5,
  })
}
