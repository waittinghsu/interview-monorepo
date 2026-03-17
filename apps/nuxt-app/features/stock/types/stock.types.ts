export interface StockParams {
  range?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max'
  interval?: '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo'
  period1?: number
  period2?: number
  events?: string
  includeAdjustedClose?: boolean
}

// 新 API 回傳格式（useBusinessApiClient 已解包 data 層）
export interface StockChartResponse {
  symbol: string
  longName: string
  currency: string
  exchangeName: string
  price: number
  previousClose: number
  open: number
  dayHigh: number
  dayLow: number
  volume: number
  timestamps: number[]
  prices: number[]
}

export interface LineChartData {
  time: string
  value: number
}

// ChartData (OHLCV) 保留備用
export interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
}
