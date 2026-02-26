import type { ChartData, LineChartData, StockParams } from '../types/stock.types'
import { useQuery } from '@tanstack/vue-query'
import { useStockService } from '../services/stock.service'

/**
 * Stock Composable - TanStack Query hooks
 * Composable 層：封裝 Service 並提供 Query hooks
 *
 * 資料來源：YAPI Mock（Yahoo Finance 格式）
 * - 回傳格式：{ chart: { result: [...], error: null } }
 * - 需要手動解析 Yahoo Finance 格式
 */

// Query Keys
export const stockKeys = {
  all: ['stock'] as const,
  chart: (symbol: string, params?: { range?: string, interval?: string }) =>
    [...stockKeys.all, 'chart', symbol, params] as const,
}

/**
 * 取得股票圖表資料 Query
 */
export function useStockChartQuery(symbol: string, params: StockParams = {}) {
  const stockService = useStockService()

  return useQuery({
    queryKey: stockKeys.chart(symbol, params),
    queryFn: async () => {
      // yapimock 會返回已解包的 data（陣列格式）
      // 格式：[{ time, open, high, low, close, volume }, ...]
      return await stockService.getChart(symbol, params)
    },
    // ✅ SSR 優化：只在客戶端執行
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 5, // 5分鐘內不重新獲取
  })
}

/**
 * 取得 0050 資料 Query
 */
export function use0050Query(params: StockParams = { range: '1mo', interval: '1d' }) {
  const stockService = useStockService()

  return useQuery({
    queryKey: stockKeys.chart('0050.TW', params),
    queryFn: async () => {
      // Yahoo Finance 格式：{ chart: { result: [...], error: null } }
      const response = await stockService.get0050(params)
      const result = response.chart.result[0]
      const timestamps = result.timestamp
      const quotes = result.indicators.quote[0]

      // 轉換成 K線圖格式
      const chartData: ChartData[] = timestamps
        .map((timestamp: number, index: number) => ({
          time: new Date(timestamp * 1000).toISOString().split('T')[0],
          open: quotes.open[index],
          high: quotes.high[index],
          low: quotes.low[index],
          close: quotes.close[index],
        }))
        .filter((item: ChartData) => item.open !== null)

      return chartData
    },
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * 取得比特幣資料 Query
 */
export function useBTCQuery(params: StockParams = { range: '1mo', interval: '1d' }) {
  const stockService = useStockService()

  return useQuery({
    queryKey: stockKeys.chart('BTC-USD', params),
    queryFn: async () => {
      // Yahoo Finance 格式：{ chart: { result: [...], error: null } }
      const response = await stockService.getBTC(params)
      const result = response.chart.result[0]
      const timestamps = result.timestamp
      const quotes = result.indicators.quote[0]

      // 轉換成折線圖格式
      const chartData: LineChartData[] = timestamps
        .map((timestamp: number, index: number) => ({
          time: new Date(timestamp * 1000).toISOString().split('T')[0],
          value: quotes.close[index],
        }))
        .filter((item: LineChartData) => item.value !== null)

      return chartData
    },
    enabled: import.meta.client,
    staleTime: 1000 * 60 * 5,
  })
}
