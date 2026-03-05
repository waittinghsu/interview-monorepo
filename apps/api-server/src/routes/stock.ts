import type { FastifyInstance } from 'fastify'

const YAHOO_FINANCE_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'

export async function stockRoutes(app: FastifyInstance) {
  // GET /v1/api/stock/:symbol
  app.get('/v1/api/stock/:symbol', {
    schema: {
      tags: ['股票類'],
      summary: '獲取-股票即時行情',
      description: '代理 Yahoo Finance API 取得台灣/全球股票即時報價與歷史圖表資料',
      params: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            title: '股票代號',
            description: '股票代號，台股請加 .TW 後綴，如 0050.TW；美股直接使用代號如 AAPL',
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          range: {
            type: 'string',
            default: '1d',
            title: '時間範圍',
            description: '資料時間範圍：1d=今日, 5d=五日, 1mo=一個月, 3mo=三個月, 6mo=六個月, 1y=一年, 5y=五年',
          },
          interval: {
            type: 'string',
            default: '5m',
            title: '資料間隔',
            description: '資料取樣間隔：1m=1分鐘, 5m=5分鐘, 15m=15分鐘, 1h=1小時, 1d=1天',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼', description: '200 表示成功' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息', description: '操作結果訊息' },
            data: {
              type: 'object',
              properties: {
                symbol: { type: 'string', mock: { mock: '0050.TW' }, title: '股票代號', description: '查詢的股票代號' },
                longName: { type: 'string', mock: { mock: '元大台灣50' }, title: '股票全名', description: '股票完整名稱' },
                currency: { type: 'string', mock: { mock: 'TWD' }, title: '貨幣單位', description: '股票交易貨幣' },
                exchangeName: { type: 'string', mock: { mock: 'TAI' }, title: '交易所', description: '股票上市交易所代碼' },
                price: { type: 'number', mock: { mock: '@float(50,500,0,2)' }, title: '當前價格', description: '最新成交價格' },
                previousClose: { type: 'number', mock: { mock: '@float(50,500,0,2)' }, title: '昨日收盤價', description: '前一個交易日收盤價格' },
                open: { type: 'number', mock: { mock: '@float(50,500,0,2)' }, title: '今日開盤價', description: '當日開盤價格' },
                dayHigh: { type: 'number', mock: { mock: '@float(50,500,0,2)' }, title: '今日最高價', description: '當日盤中最高價格' },
                dayLow: { type: 'number', mock: { mock: '@float(50,500,0,2)' }, title: '今日最低價', description: '當日盤中最低價格' },
                volume: { type: 'number', mock: { mock: '@natural(100000,9999999)' }, title: '成交量', description: '當日總成交量（股數）' },
                timestamps: {
                  type: 'array',
                  items: { type: 'number', mock: { mock: '@natural(1700000000,1800000000)' } },
                  title: '時間戳列表',
                  description: 'Unix 時間戳陣列，對應 prices 陣列中每個點的時間',
                },
                prices: {
                  type: 'array',
                  items: { type: 'number', mock: { mock: '@float(50,500,0,2)' } },
                  title: '價格列表',
                  description: '歷史價格陣列，對應 timestamps 中每個時間點的收盤價',
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { symbol } = request.params as { symbol: string }
    const { range = '1d', interval = '5m' } = request.query as { range?: string, interval?: string }

    const trimmedSymbol = symbol.trim()
    if (!trimmedSymbol) {
      reply.status(400)
      return { code: 400, msg: '股票代號不得為空', data: null }
    }

    const url = `${YAHOO_FINANCE_BASE}/${encodeURIComponent(trimmedSymbol)}?range=${range}&interval=${interval}&includePrePost=false`

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; interview-api/1.0)',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        reply.status(502)
        return { code: 502, msg: `Yahoo Finance 返回錯誤：HTTP ${response.status}`, data: null }
      }

      const json: any = await response.json()
      const result = json?.chart?.result

      if (!result || result.length === 0) {
        const error = json?.chart?.error
        reply.status(502)
        return { code: 502, msg: error?.description ?? `找不到股票代號：${trimmedSymbol}`, data: null }
      }

      const meta = result[0].meta
      const timestamps: number[] = result[0].timestamp ?? []
      const closePrices: (number | null)[] = result[0].indicators?.quote?.[0]?.close ?? []

      return {
        code: 200,
        msg: 'OK',
        data: {
          symbol: meta.symbol ?? trimmedSymbol,
          longName: meta.longName ?? meta.shortName ?? '',
          currency: meta.currency ?? '',
          exchangeName: meta.exchangeName ?? '',
          price: meta.regularMarketPrice ?? null,
          previousClose: meta.previousClose ?? meta.chartPreviousClose ?? null,
          open: meta.regularMarketOpen ?? null,
          dayHigh: meta.regularMarketDayHigh ?? null,
          dayLow: meta.regularMarketDayLow ?? null,
          volume: meta.regularMarketVolume ?? null,
          timestamps,
          prices: closePrices,
        },
      }
    }
    catch (err) {
      app.log.error(err, 'Stock proxy error')
      reply.status(502)
      return { code: 502, msg: '無法連接 Yahoo Finance', data: null }
    }
  })
}
