export interface StockParams {
  range?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
  interval?: '1m' | '5m' | '15m' | '1h' | '1d' | '1wk' | '1mo'
}

export interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export interface LineChartData {
  time: string
  value: number
}

export interface YahooFinanceResponse {
  chart: {
    result: Array<{
      timestamp: number[]
      indicators: {
        quote: Array<{
          open: number[]
          high: number[]
          low: number[]
          close: number[]
          volume: number[]
        }>
      }
    }>
    error: null
  }
}
