import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'
import { buildApp, loginAsDemo } from '../test/helpers.js'

const sampleGameBody = {
  title: '薩爾達傳說：王國之淚',
  description: '探索廣大的海拉魯大陸，揭開古老王國的秘密，在天空、地表與地底進行冒險',
  genre: 'Action-Adventure',
  platform: ['Nintendo Switch'],
  rating: 9.8,
  price: 1799,
  releaseDate: '2023-05-12T00:00:00.000Z',
  developer: 'Nintendo EPD',
  publisher: 'Nintendo',
  imageUrl: 'https://example.com/zelda-totk.jpg',
  tags: ['open-world', 'adventure', 'fantasy', 'zelda'],
  isActive: true,
}

describe('Game Routes', () => {
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
    await prisma.game.deleteMany()
  })

  // ── GET /v1/api/games ──────────────────────────────────────────────────────
  describe('GET /v1/api/games', () => {
    it('should return empty list when no games', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/games' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.list).toEqual([])
      expect(body.data.total).toBe(0)
      expect(body.data.page).toBe(1)
      expect(body.data.limit).toBe(10)
    })

    it('should return paginated game list', async () => {
      await prisma.game.create({
        data: {
          title: '薩爾達傳說：王國之淚',
          description: '探索廣大的海拉魯大陸',
          genre: 'Action-Adventure',
          platform: ['Nintendo Switch'],
          rating: 9.8,
          price: 1799,
          releaseDate: new Date('2023-05-12'),
          developer: 'Nintendo EPD',
          publisher: 'Nintendo',
          tags: ['open-world'],
        },
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/games?page=1&limit=10' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.list).toHaveLength(1)
      expect(body.data.total).toBe(1)
      expect(body.data.totalPages).toBe(1)
      expect(body.data.list[0].price).toBe('1799.00')
      expect(body.data.list[0].rating).toBe('9.8')
    })

    it('should filter games by genre', async () => {
      await prisma.game.createMany({
        data: [
          { title: 'RPG Game', description: 'desc', genre: 'RPG', platform: ['PC'], price: 999, releaseDate: new Date(), developer: 'Dev', publisher: 'Pub', tags: [] },
          { title: 'Action Game', description: 'desc', genre: 'Action', platform: ['PC'], price: 799, releaseDate: new Date(), developer: 'Dev', publisher: 'Pub', tags: [] },
        ],
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/games?genre=RPG' })
      const body = JSON.parse(res.body)
      expect(body.data.total).toBe(1)
      expect(body.data.list[0].genre).toBe('RPG')
    })
  })

  // ── POST /v1/api/games ─────────────────────────────────────────────────────
  describe('POST /v1/api/games', () => {
    it('should return 401 without auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/games',
        payload: sampleGameBody,
      })
      expect(res.statusCode).toBe(401)
    })

    it('should create a game with valid auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/games',
        headers: { authorization: `Bearer ${token}` },
        payload: sampleGameBody,
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.gameId).toBeDefined()
      expect(body.data.title).toBe(sampleGameBody.title)
      expect(body.data.genre).toBe(sampleGameBody.genre)
      expect(body.data.price).toBe('1799.00')
      expect(body.data.platform).toEqual(['Nintendo Switch'])
    })
  })

  // ── GET /v1/api/games/:gameId ──────────────────────────────────────────────
  describe('GET /v1/api/games/:gameId', () => {
    it('should return 404 for non-existent game', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/games/non-existent-id' })
      expect(res.statusCode).toBe(404)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(404)
    })

    it('should return game detail by gameId', async () => {
      const game = await prisma.game.create({
        data: {
          title: '薩爾達傳說：王國之淚',
          description: '探索廣大的海拉魯大陸',
          genre: 'Action-Adventure',
          platform: ['Nintendo Switch'],
          price: 1799,
          releaseDate: new Date('2023-05-12'),
          developer: 'Nintendo EPD',
          publisher: 'Nintendo',
          tags: ['open-world'],
        },
      })
      const res = await app.inject({ method: 'GET', url: `/v1/api/games/${game.gameId}` })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.gameId).toBe(game.gameId)
      expect(body.data.title).toBe('薩爾達傳說：王國之淚')
      expect(body.data.developer).toBe('Nintendo EPD')
    })
  })

  // ── PUT /v1/api/games/:gameId ──────────────────────────────────────────────
  describe('PUT /v1/api/games/:gameId', () => {
    it('should return 401 without auth', async () => {
      const game = await prisma.game.create({
        data: {
          title: 'Test Game', description: 'desc', genre: 'RPG', platform: ['PC'],
          price: 999, releaseDate: new Date(), developer: 'Dev', publisher: 'Pub', tags: [],
        },
      })
      const res = await app.inject({ method: 'PUT', url: `/v1/api/games/${game.gameId}`, payload: { title: 'Updated' } })
      expect(res.statusCode).toBe(401)
    })

    it('should update game with auth', async () => {
      const game = await prisma.game.create({
        data: {
          title: 'Original Title', description: 'desc', genre: 'RPG', platform: ['PC'],
          price: 999, releaseDate: new Date(), developer: 'Dev', publisher: 'Pub', tags: [],
        },
      })
      const res = await app.inject({
        method: 'PUT',
        url: `/v1/api/games/${game.gameId}`,
        headers: { authorization: `Bearer ${token}` },
        payload: { title: '更新後的遊戲名稱', price: 1299 },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.title).toBe('更新後的遊戲名稱')
      expect(body.data.price).toBe('1299.00')
    })

    it('should return 404 for non-existent game', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/v1/api/games/non-existent-id',
        headers: { authorization: `Bearer ${token}` },
        payload: { title: 'Updated' },
      })
      expect(res.statusCode).toBe(404)
    })
  })

  // ── DELETE /v1/api/games/:gameId ───────────────────────────────────────────
  describe('DELETE /v1/api/games/:gameId', () => {
    it('should return 401 without auth', async () => {
      const game = await prisma.game.create({
        data: {
          title: 'Test Game', description: 'desc', genre: 'RPG', platform: ['PC'],
          price: 999, releaseDate: new Date(), developer: 'Dev', publisher: 'Pub', tags: [],
        },
      })
      const res = await app.inject({ method: 'DELETE', url: `/v1/api/games/${game.gameId}` })
      expect(res.statusCode).toBe(401)
    })

    it('should delete game with auth', async () => {
      const game = await prisma.game.create({
        data: {
          title: 'Test Game', description: 'desc', genre: 'RPG', platform: ['PC'],
          price: 999, releaseDate: new Date(), developer: 'Dev', publisher: 'Pub', tags: [],
        },
      })
      const res = await app.inject({
        method: 'DELETE',
        url: `/v1/api/games/${game.gameId}`,
        headers: { authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)

      // Verify deleted
      const check = await prisma.game.findUnique({ where: { gameId: game.gameId } })
      expect(check).toBeNull()
    })

    it('should return 404 for non-existent game', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/v1/api/games/non-existent-id',
        headers: { authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(404)
    })
  })
})
