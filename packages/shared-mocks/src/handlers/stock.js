import { http, HttpResponse } from 'msw'

// Yahoo Finance API 的真實 response (0050.TW)
const yahooFinanceResponse = {
  chart: {
    result: [{
      meta: {
        currency: 'TWD',
        symbol: '0050.TW',
        exchangeName: 'TAI',
        fullExchangeName: 'Taiwan',
        instrumentType: 'ETF',
        firstTradeDate: 1230771600,
        regularMarketTime: 1770269405,
        hasPrePostMarketData: false,
        gmtoffset: 28800,
        timezone: 'CST',
        exchangeTimezoneName: 'Asia/Taipei',
        regularMarketPrice: 72.0,
        fiftyTwoWeekHigh: 74.5,
        fiftyTwoWeekLow: 36.25,
        regularMarketDayHigh: 72.25,
        regularMarketDayLow: 71.75,
        regularMarketVolume: 107356136,
        longName: 'Yuanta/P-shares Taiwan Top 50 ETF',
        shortName: 'YUANTA SECURITIES INV TRUST CO ',
        chartPreviousClose: 72.9,
        previousClose: 72.9,
        scale: 3,
        priceHint: 2,
      },
      timestamp: [1735689600, 1735776000, 1735862400, 1736121600, 1736208000, 1736294400, 1736380800, 1736467200, 1736726400, 1736812800, 1736899200, 1736985600, 1737072000, 1737331200, 1737417600, 1737504000, 1737590400, 1737676800],
      indicators: {
        quote: [{
          high: [198.5, 198.0, 196.5, 195.5, 196.0, 197.0, 198.5, 199.0, 200.5, 201.0, 199.5, 198.0, 197.5, 198.0, 199.5, 200.0, 201.5, 202.0],
          volume: [15234567, 14567890, 13987654, 15678901, 16234567, 14876543, 15987654, 16345678, 17234567, 15678901, 14987654, 14234567, 15432109, 16234567, 15876543, 16987654, 17345678, 16543210],
          low: [196.0, 195.5, 194.0, 193.5, 194.0, 195.0, 196.5, 197.0, 198.5, 199.0, 197.5, 196.0, 195.5, 196.0, 197.5, 198.0, 199.5, 200.0],
          close: [197.5, 196.0, 195.0, 194.5, 195.5, 196.5, 198.0, 198.5, 200.0, 200.5, 198.0, 197.0, 196.5, 197.5, 199.0, 199.5, 201.0, 201.5],
          open: [197.0, 197.5, 196.5, 195.0, 194.5, 195.5, 197.0, 198.0, 199.0, 200.0, 200.5, 198.5, 197.0, 196.5, 197.5, 199.0, 200.0, 201.0],
        }],
      },
    }],
    error: null,
  },
}

// Bitcoin 模擬資料
const btcResponse = {
  chart: {
    result: [{
      meta: {
        currency: 'USD',
        symbol: 'BTC-USD',
        exchangeName: 'CCC',
        fullExchangeName: 'CCC',
        instrumentType: 'CRYPTOCURRENCY',
        regularMarketPrice: 95000,
        previousClose: 94500,
      },
      timestamp: [1735689600, 1735776000, 1735862400, 1736121600, 1736208000, 1736294400, 1736380800, 1736467200, 1736726400, 1736812800, 1736899200, 1736985600, 1737072000, 1737331200, 1737417600, 1737504000, 1737590400, 1737676800],
      indicators: {
        quote: [{
          high: [95500, 96000, 94500, 93000, 94000, 95500, 97000, 98000, 99500, 100000, 98500, 97000, 96000, 95500, 96500, 97500, 99000, 100500],
          volume: [25000000, 23000000, 27000000, 28000000, 26000000, 24000000, 25500000, 26500000, 28500000, 30000000, 27500000, 26000000, 25000000, 24500000, 26000000, 27000000, 28000000, 29000000],
          low: [93000, 94000, 92500, 91000, 92500, 93500, 95000, 96500, 97500, 98000, 96500, 95000, 94000, 94000, 95000, 96000, 97500, 99000],
          close: [94500, 95000, 93500, 92000, 93500, 95000, 96500, 97500, 99000, 99500, 97000, 96000, 95000, 95000, 96000, 97000, 98500, 100000],
          open: [94000, 94500, 95000, 93500, 92000, 93500, 95000, 96500, 97500, 99000, 99500, 97000, 96000, 95000, 95000, 96000, 97000, 98500],
        }],
      },
    }],
    error: null,
  },
}

export const stockHandlers = [
  // Stock API - 通用路徑參數模式
  http.get('/v8/finance/chart/:symbol', ({ params, request }) => {
    const { symbol } = params
    const url = new URL(request.url)
    const range = url.searchParams.get('range')
    const interval = url.searchParams.get('interval')

    console.log('[MSW] Stock API called:', { symbol, range, interval })

    // 根據 symbol 回傳對應資料
    if (symbol === '0050.TW') {
      return HttpResponse.json(yahooFinanceResponse)
    }
    else if (symbol === 'BTC-USD') {
      return HttpResponse.json(btcResponse)
    }

    // 未知 symbol，回傳錯誤
    return HttpResponse.json({
      chart: {
        result: null,
        error: { code: 'Not Found', description: `Unknown symbol: ${symbol}` },
      },
    }, { status: 404 })
  }),
]