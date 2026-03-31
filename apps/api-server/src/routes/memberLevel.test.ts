import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'
import { buildApp, loginAsDemo } from '../test/helpers.js'

const sampleLevelBody = {
  levelId: 1,
  name: '普通會員',
  minPoints: 0,
  maxPoints: 999,
  discount: 1.00,
  benefits: ['生日禮券', '每月電子報'],
  badgeUrl: 'https://example.com/badge-normal.png',
}

describe('MemberLevel Routes', () => {
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
    await prisma.memberLevel.deleteMany()
  })

  // ── GET /v1/api/member-levels ──────────────────────────────────────────────
  describe('GET /v1/api/member-levels', () => {
    it('should return empty list when no levels', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/member-levels' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.list).toEqual([])
      expect(body.data.total).toBe(0)
    })

    it('should return all member levels ordered by levelId', async () => {
      await prisma.memberLevel.createMany({
        data: [
          { levelId: 3, name: '黃金會員', minPoints: 5000, maxPoints: 9999, benefits: ['8折優惠'] },
          { levelId: 1, name: '普通會員', minPoints: 0, maxPoints: 999, benefits: ['生日禮券'] },
          { levelId: 2, name: '銀牌會員', minPoints: 1000, maxPoints: 4999, benefits: ['9折優惠'] },
        ],
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/member-levels' })
      const body = JSON.parse(res.body)
      expect(body.data.total).toBe(3)
      expect(body.data.list[0].levelId).toBe(1)
      expect(body.data.list[1].levelId).toBe(2)
      expect(body.data.list[2].levelId).toBe(3)
    })
  })

  // ── POST /v1/api/member-levels ─────────────────────────────────────────────
  describe('POST /v1/api/member-levels', () => {
    it('should return 401 without auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/member-levels',
        payload: sampleLevelBody,
      })
      expect(res.statusCode).toBe(401)
    })

    it('should create a member level with valid auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/member-levels',
        headers: { authorization: `Bearer ${token}` },
        payload: sampleLevelBody,
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.levelId).toBe(sampleLevelBody.levelId)
      expect(body.data.name).toBe(sampleLevelBody.name)
      expect(body.data.discount).toBe('1.00')
    })
  })

  // ── GET /v1/api/member-levels/:levelId ─────────────────────────────────────
  describe('GET /v1/api/member-levels/:levelId', () => {
    it('should return 404 for non-existent level', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/member-levels/999' })
      expect(res.statusCode).toBe(404)
    })

    it('should return member level by levelId', async () => {
      await prisma.memberLevel.create({
        data: { levelId: 1, name: '普通會員', minPoints: 0, maxPoints: 999, benefits: ['生日禮券'] },
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/member-levels/1' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.levelId).toBe(1)
      expect(body.data.name).toBe('普通會員')
    })
  })

  // ── PUT /v1/api/member-levels/:levelId ─────────────────────────────────────
  describe('PUT /v1/api/member-levels/:levelId', () => {
    it('should return 401 without auth', async () => {
      await prisma.memberLevel.create({
        data: { levelId: 1, name: '普通會員', minPoints: 0, maxPoints: 999, benefits: [] },
      })
      const res = await app.inject({ method: 'PUT', url: '/v1/api/member-levels/1', payload: { name: 'Updated' } })
      expect(res.statusCode).toBe(401)
    })

    it('should update member level with auth', async () => {
      await prisma.memberLevel.create({
        data: { levelId: 2, name: '銀牌會員', minPoints: 1000, maxPoints: 4999, benefits: ['9折優惠'] },
      })
      const res = await app.inject({
        method: 'PUT',
        url: '/v1/api/member-levels/2',
        headers: { authorization: `Bearer ${token}` },
        payload: { name: '白銀VIP', discount: 0.88 },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.name).toBe('白銀VIP')
      expect(body.data.discount).toBe('0.88')
    })
  })

  // ── DELETE /v1/api/member-levels/:levelId ──────────────────────────────────
  describe('DELETE /v1/api/member-levels/:levelId', () => {
    it('should return 401 without auth', async () => {
      await prisma.memberLevel.create({
        data: { levelId: 1, name: '普通會員', minPoints: 0, maxPoints: 999, benefits: [] },
      })
      const res = await app.inject({ method: 'DELETE', url: '/v1/api/member-levels/1' })
      expect(res.statusCode).toBe(401)
    })

    it('should delete member level with auth', async () => {
      await prisma.memberLevel.create({
        data: { levelId: 5, name: '鑽石會員', minPoints: 50000, maxPoints: 999999, benefits: ['7折'] },
      })
      const res = await app.inject({
        method: 'DELETE',
        url: '/v1/api/member-levels/5',
        headers: { authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)

      const check = await prisma.memberLevel.findUnique({ where: { levelId: 5 } })
      expect(check).toBeNull()
    })
  })
})
