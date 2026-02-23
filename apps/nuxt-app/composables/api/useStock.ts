import { useQuery } from '@tanstack/vue-query'
import { createStockService } from '~/services/stock'
import { useHttpClient } from './useHttpClient'

/**
 * Stock Composable - TanStack Query hooks
 * Composable 層：封裝 Service 並提供 Query hooks
 */

// Query Keys
export const stockKeys = {
  all: ['stock'] as const,
  chart: (symbol: string, params?: { range?: string, interval?: string }) =>
    [...stockKeys.all, 'chart', symbol, params] as const,
}

interface StockParams {
  range?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
  interval?: '1m' | '5m' | '15m' | '1h' | '1d' | '1wk' | '1mo'
}

interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface LineChartData {
  time: string
  value: number
}

/**
 * 取得股票圖表資料 Query
 */
export function useStockChartQuery(symbol: string, params: StockParams = {}) {
  const httpClient = useHttpClient()
  const stockService = createStockService(httpClient)

  return useQuery({
    queryKey: stockKeys.chart(symbol, params),
    queryFn: async () => {
      const response = await stockService.getChart(symbol, {
        range: params.range || '1mo',
        interval: params.interval || '1d',
      })
      const result = response.data.chart.result[0]
      const timestamps = result.timestamp
      const quotes = result.indicators.quote[0]

      // 轉換成 lightweight-charts 格式
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
  })
}

/**
 * 取得 0050 資料 Query
 */
export function use0050Query(params: StockParams = { range: '1mo', interval: '1d' }) {
  const httpClient = useHttpClient()
  const stockService = createStockService(httpClient)

  return useQuery({
    queryKey: stockKeys.chart('0050.TW', params),
    queryFn: async () => {
      const response = await stockService.get0050(params)
      const result = response.data.chart.result[0]
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
  })
}

/**
 * 取得比特幣資料 Query
 */
export function useBTCQuery(params: StockParams = { range: '1mo', interval: '1d' }) {
  const httpClient = useHttpClient()
  const stockService = createStockService(httpClient)

  return useQuery({
    queryKey: stockKeys.chart('BTC-USD', params),
    queryFn: async () => {
      const response = await stockService.getBTC(params)
      const result = response.data.chart.result[0]
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
  })
}
