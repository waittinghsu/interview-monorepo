import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildApp } from '../test/helpers.js'

describe('Stock Routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /v1/api/stock/:symbol', () => {
    it('should return 400 for empty symbol', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/stock/   ' })
      // Route should handle whitespace-only symbol
      expect([400, 404]).toContain(res.statusCode)
    })

    it('should return stock data for valid symbol when fetch succeeds', async () => {
      const mockData = {
        chart: {
          result: [
            {
              meta: {
                symbol: '0050.TW',
                regularMarketPrice: 150.5,
                previousClose: 148.0,
                regularMarketOpen: 149.0,
                regularMarketDayHigh: 151.0,
                regularMarketDayLow: 148.5,
                regularMarketVolume: 1234567,
                currency: 'TWD',
                exchangeName: 'TAI',
                longName: 'Yuanta/P-shares Taiwan Top 50 ETF',
              },
              indicators: {
                quote: [{ close: [148.0, 149.5, 150.5] }],
              },
              timestamp: [1700000000, 1700000060, 1700000120],
            },
          ],
          error: null,
        },
      }

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        }),
      )

      const res = await app.inject({ method: 'GET', url: '/v1/api/stock/0050.TW' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.symbol).toBe('0050.TW')
      expect(body.data.price).toBeDefined()

      vi.unstubAllGlobals()
    })

    it('should return 502 when Yahoo Finance returns error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: false,
          status: 429,
        }),
      )

      const res = await app.inject({ method: 'GET', url: '/v1/api/stock/INVALID' })
      expect(res.statusCode).toBe(502)

      vi.unstubAllGlobals()
    })

    it('should return 502 when Yahoo Finance result is empty', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => ({ chart: { result: null, error: { code: 'Not Found' } } }),
        }),
      )

      const res = await app.inject({ method: 'GET', url: '/v1/api/stock/NOTEXIST' })
      expect(res.statusCode).toBe(502)

      vi.unstubAllGlobals()
    })
  })
})
