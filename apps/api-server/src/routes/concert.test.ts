import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'
import { buildApp, loginAsDemo } from '../test/helpers.js'

const sampleVenue = {
  name: '台北小巨蛋',
  address: '台北市松山區南京東路四段2號',
  city: '台北市',
  capacity: 15000,
}

const sampleTickets = [
  { type: 'VIP', name: 'VIP 座位', price: '6800', quantity: 500, available: 500 },
  { type: 'A', name: 'A 區座位', price: '3800', quantity: 2000, available: 2000 },
  { type: 'B', name: 'B 區座位', price: '2800', quantity: 5000, available: 5000 },
]

const sampleConcertBody = {
  title: 'Jay Chou 魔天倫世界巡迴演唱會',
  artist: '周杰倫',
  venue: sampleVenue,
  organizer: '相信音樂',
  performanceDate: '2024-08-15T19:00:00.000Z',
  saleStartDate: '2024-06-01T10:00:00.000Z',
  saleEndDate: '2024-08-14T23:59:59.000Z',
  description: '周杰倫最新世界巡迴演唱會，帶來精彩演出與全新歌曲',
  imageUrl: 'https://example.com/jay-concert.jpg',
  tickets: sampleTickets,
  status: 'upcoming',
}

describe('Concert Routes', () => {
  let app: FastifyInstance
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = await loginAsDemo(app)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.concert.deleteMany()
  })

  // ── GET /v1/api/concerts ───────────────────────────────────────────────────
  describe('GET /v1/api/concerts', () => {
    it('should return empty list when no concerts', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/concerts' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.list).toEqual([])
      expect(body.data.total).toBe(0)
    })

    it('should return paginated concert list', async () => {
      await prisma.concert.create({
        data: {
          title: 'Test Concert',
          artist: '測試歌手',
          venue: sampleVenue,
          organizer: '主辦單位',
          performanceDate: new Date('2024-08-15T19:00:00.000Z'),
          saleStartDate: new Date('2024-06-01T10:00:00.000Z'),
          saleEndDate: new Date('2024-08-14T23:59:59.000Z'),
          description: '演唱會說明',
          tickets: sampleTickets,
        },
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/concerts?page=1&limit=10' })
      const body = JSON.parse(res.body)
      expect(body.data.list).toHaveLength(1)
      expect(body.data.total).toBe(1)
    })

    it('should filter concerts by status', async () => {
      await prisma.concert.createMany({
        data: [
          {
            title: 'Upcoming Show', artist: 'A', venue: sampleVenue, organizer: 'O',
            performanceDate: new Date('2025-01-01'), saleStartDate: new Date('2024-01-01'),
            saleEndDate: new Date('2024-12-31'), description: 'd', tickets: [], status: 'upcoming',
          },
          {
            title: 'Sold Out Show', artist: 'B', venue: sampleVenue, organizer: 'O',
            performanceDate: new Date('2024-05-01'), saleStartDate: new Date('2024-01-01'),
            saleEndDate: new Date('2024-04-30'), description: 'd', tickets: [], status: 'soldout',
          },
        ],
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/concerts?status=upcoming' })
      const body = JSON.parse(res.body)
      expect(body.data.total).toBe(1)
      expect(body.data.list[0].status).toBe('upcoming')
    })
  })

  // ── POST /v1/api/concerts ──────────────────────────────────────────────────
  describe('POST /v1/api/concerts', () => {
    it('should return 401 without auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/concerts',
        payload: sampleConcertBody,
      })
      expect(res.statusCode).toBe(401)
    })

    it('should create a concert with valid auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/concerts',
        headers: { authorization: `Bearer ${token}` },
        payload: sampleConcertBody,
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.concertId).toBeDefined()
      expect(body.data.title).toBe(sampleConcertBody.title)
      expect(body.data.artist).toBe(sampleConcertBody.artist)
      expect(body.data.venue).toMatchObject(sampleVenue)
      expect(body.data.tickets).toHaveLength(3)
    })
  })

  // ── GET /v1/api/concerts/:concertId ───────────────────────────────────────
  describe('GET /v1/api/concerts/:concertId', () => {
    it('should return 404 for non-existent concert', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/concerts/non-existent-id' })
      expect(res.statusCode).toBe(404)
    })

    it('should return concert detail by concertId', async () => {
      const concert = await prisma.concert.create({
        data: {
          title: 'Jay Chou Concert',
          artist: '周杰倫',
          venue: sampleVenue,
          organizer: '相信音樂',
          performanceDate: new Date('2024-08-15T19:00:00.000Z'),
          saleStartDate: new Date('2024-06-01T10:00:00.000Z'),
          saleEndDate: new Date('2024-08-14T23:59:59.000Z'),
          description: '演唱會',
          tickets: sampleTickets,
        },
      })
      const res = await app.inject({ method: 'GET', url: `/v1/api/concerts/${concert.concertId}` })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.concertId).toBe(concert.concertId)
      expect(body.data.artist).toBe('周杰倫')
      expect(body.data.venue).toMatchObject(sampleVenue)
    })
  })

  // ── PUT /v1/api/concerts/:concertId ───────────────────────────────────────
  describe('PUT /v1/api/concerts/:concertId', () => {
    it('should return 401 without auth', async () => {
      const concert = await prisma.concert.create({
        data: {
          title: 'Test', artist: 'A', venue: sampleVenue, organizer: 'O',
          performanceDate: new Date(), saleStartDate: new Date(), saleEndDate: new Date(),
          description: 'd', tickets: [],
        },
      })
      const res = await app.inject({ method: 'PUT', url: `/v1/api/concerts/${concert.concertId}`, payload: { status: 'soldout' } })
      expect(res.statusCode).toBe(401)
    })

    it('should update concert with auth', async () => {
      const concert = await prisma.concert.create({
        data: {
          title: 'Original Concert', artist: 'A', venue: sampleVenue, organizer: 'O',
          performanceDate: new Date(), saleStartDate: new Date(), saleEndDate: new Date(),
          description: 'd', tickets: [],
        },
      })
      const res = await app.inject({
        method: 'PUT',
        url: `/v1/api/concerts/${concert.concertId}`,
        headers: { authorization: `Bearer ${token}` },
        payload: { title: '更新後的演唱會', status: 'soldout' },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.title).toBe('更新後的演唱會')
      expect(body.data.status).toBe('soldout')
    })
  })

  // ── DELETE /v1/api/concerts/:concertId ────────────────────────────────────
  describe('DELETE /v1/api/concerts/:concertId', () => {
    it('should return 401 without auth', async () => {
      const concert = await prisma.concert.create({
        data: {
          title: 'Test', artist: 'A', venue: sampleVenue, organizer: 'O',
          performanceDate: new Date(), saleStartDate: new Date(), saleEndDate: new Date(),
          description: 'd', tickets: [],
        },
      })
      const res = await app.inject({ method: 'DELETE', url: `/v1/api/concerts/${concert.concertId}` })
      expect(res.statusCode).toBe(401)
    })

    it('should delete concert with auth', async () => {
      const concert = await prisma.concert.create({
        data: {
          title: 'To Delete', artist: 'A', venue: sampleVenue, organizer: 'O',
          performanceDate: new Date(), saleStartDate: new Date(), saleEndDate: new Date(),
          description: 'd', tickets: [],
        },
      })
      const res = await app.inject({
        method: 'DELETE',
        url: `/v1/api/concerts/${concert.concertId}`,
        headers: { authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)

      const check = await prisma.concert.findUnique({ where: { concertId: concert.concertId } })
      expect(check).toBeNull()
    })
  })
})
