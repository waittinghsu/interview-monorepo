import type { MaybeRefOrGetter } from 'vue'
import type { ChartData, LineChartData, StockParams } from '../types/stock.types'
import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { useStockService } from '../services/stock.service'

/**
 * Stock Composable - TanStack Query hooks
 * Composable 層：封裝 Service 並提供 Query hooks
 *
 * 資料來源：api-server（業務格式）
 * - 回傳格式：{ timestamps, open[], high[], low[], close[], volume[], ... }
 * - useBusinessApiClient 已解包 data 層
 */

// Query Keys
export const stockKeys = {
  all: ['stock'] as const,
  chart: (symbol: string, params?: { range?: string, interval?: string }) =>
    [...stockKeys.all, 'chart', symbol, params] as const,
}

/** timestamps + OHLC → CandlestickData[]（去重 + 過濾無效值） */
function toCandlestickData(
  timestamps: number[],
  openPrices: number[],
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[],
): ChartData[] {
  const seenByDate = new Map<string, ChartData>()
  timestamps.forEach((timestamp, index) => {
    const openPrice = openPrices[index]
    const highPrice = highPrices[index]
    const lowPrice = lowPrices[index]
    const closePrice = closePrices[index]
    if (!openPrice || !highPrice || !lowPrice || !closePrice)
      return
    const date = new Date(timestamp * 1000).toISOString().split('T')[0]
    seenByDate.set(date, { time: date, open: openPrice, high: highPrice, low: lowPrice, close: closePrice })
  })
  return Array.from(seenByDate.values())
}

/** timestamps + close → LineChartData[]（去重 + 過濾無效值） */
function toLineChartData(timestamps: number[], closePrices: number[]): LineChartData[] {
  const seenByDate = new Map<string, number>()
  timestamps.forEach((timestamp, index) => {
    const closePrice = closePrices[index]
    if (!closePrice || closePrice <= 0)
      return
    const date = new Date(timestamp * 1000).toISOString().split('T')[0]
    seenByDate.set(date, closePrice)
  })
  return Array.from(seenByDate.entries()).map(([date, closePrice]) => ({ time: date, value: closePrice }))
}

/**
 * 取得 0050 資料 Query — 回傳 ChartData[]（K線圖，有 OHLC）
 */
export function use0050Query(params: MaybeRefOrGetter<StockParams> = { range: '1mo', interval: '1d' }) {
  const stockService = useStockService()

  return useQuery({
    queryKey: computed(() => stockKeys.chart('0050.TW', toValue(params))),
    queryFn: async (): Promise<ChartData[]> => {
      const queryParams = toValue(params)
      const response = await stockService.get0050(queryParams)
      return toCandlestickData(response.timestamps, response.open, response.high, response.low, response.close)
    },
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 1,
  })
}

/**
 * 取得比特幣資料 Query — 回傳 LineChartData[]（折線圖，無開收盤）
 */
export function useBTCQuery(params: MaybeRefOrGetter<StockParams> = { range: '1mo', interval: '1d' }) {
  const stockService = useStockService()

  return useQuery({
    queryKey: computed(() => stockKeys.chart('BTC-USD', toValue(params))),
    queryFn: async (): Promise<LineChartData[]> => {
      const queryParams = toValue(params)
      const response = await stockService.getBTC(queryParams)
      return toLineChartData(response.timestamps, response.close)
    },
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 5,
  })
}
