import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'
import { buildApp, loginAsDemo } from '../test/helpers.js'

const sampleBookBody = {
  title: '三體',
  author: '劉慈欣',
  isbn: '9789571375700',
  description: '中國科幻小說的巔峰之作，描述人類文明與三體文明的宇宙博弈',
  genre: '科幻',
  price: 380,
  publishDate: '2008-05-01T00:00:00.000Z',
  publisher: '大田出版',
  totalPages: 400,
  language: 'zh-TW',
  coverUrl: 'https://example.com/three-body.jpg',
  rating: 9.5,
  inStock: true,
}

describe('Book Routes', () => {
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
    await prisma.book.deleteMany()
  })

  // ── GET /v1/api/books ──────────────────────────────────────────────────────
  describe('GET /v1/api/books', () => {
    it('should return empty list when no books', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/books' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.list).toEqual([])
      expect(body.data.total).toBe(0)
    })

    it('should return paginated book list', async () => {
      await prisma.book.create({
        data: {
          title: '三體',
          author: '劉慈欣',
          isbn: '9789571375700',
          description: '中國科幻小說',
          genre: '科幻',
          price: 380,
          publishDate: new Date('2008-05-01'),
          publisher: '大田出版',
          totalPages: 400,
        },
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/books?page=1&limit=10' })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.list).toHaveLength(1)
      expect(body.data.total).toBe(1)
      expect(body.data.list[0].price).toBe('380.00')
    })

    it('should filter books by genre', async () => {
      await prisma.book.createMany({
        data: [
          { title: 'Sci-Fi Book', author: 'A', isbn: '1111', description: 'd', genre: '科幻', price: 300, publishDate: new Date(), publisher: 'P', totalPages: 200 },
          { title: 'History Book', author: 'B', isbn: '2222', description: 'd', genre: '歷史', price: 250, publishDate: new Date(), publisher: 'P', totalPages: 300 },
        ],
      })
      const res = await app.inject({ method: 'GET', url: '/v1/api/books?genre=科幻' })
      const body = JSON.parse(res.body)
      expect(body.data.total).toBe(1)
      expect(body.data.list[0].genre).toBe('科幻')
    })
  })

  // ── POST /v1/api/books ─────────────────────────────────────────────────────
  describe('POST /v1/api/books', () => {
    it('should return 401 without auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/books',
        payload: sampleBookBody,
      })
      expect(res.statusCode).toBe(401)
    })

    it('should create a book with valid auth', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/api/books',
        headers: { authorization: `Bearer ${token}` },
        payload: sampleBookBody,
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)
      expect(body.data.bookId).toBeDefined()
      expect(body.data.title).toBe(sampleBookBody.title)
      expect(body.data.author).toBe(sampleBookBody.author)
      expect(body.data.isbn).toBe(sampleBookBody.isbn)
      expect(body.data.price).toBe('380.00')
    })
  })

  // ── GET /v1/api/books/:bookId ──────────────────────────────────────────────
  describe('GET /v1/api/books/:bookId', () => {
    it('should return 404 for non-existent book', async () => {
      const res = await app.inject({ method: 'GET', url: '/v1/api/books/non-existent-id' })
      expect(res.statusCode).toBe(404)
    })

    it('should return book detail by bookId', async () => {
      const book = await prisma.book.create({
        data: {
          title: '三體',
          author: '劉慈欣',
          isbn: '9789571375700',
          description: '中國科幻小說',
          genre: '科幻',
          price: 380,
          publishDate: new Date('2008-05-01'),
          publisher: '大田出版',
          totalPages: 400,
        },
      })
      const res = await app.inject({ method: 'GET', url: `/v1/api/books/${book.bookId}` })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.bookId).toBe(book.bookId)
      expect(body.data.title).toBe('三體')
      expect(body.data.isbn).toBe('9789571375700')
    })
  })

  // ── PUT /v1/api/books/:bookId ──────────────────────────────────────────────
  describe('PUT /v1/api/books/:bookId', () => {
    it('should return 401 without auth', async () => {
      const book = await prisma.book.create({
        data: { title: 'Test', author: 'A', isbn: 'ISBN001', description: 'd', genre: '小說', price: 200, publishDate: new Date(), publisher: 'P', totalPages: 100 },
      })
      const res = await app.inject({ method: 'PUT', url: `/v1/api/books/${book.bookId}`, payload: { title: 'Updated' } })
      expect(res.statusCode).toBe(401)
    })

    it('should update book with auth', async () => {
      const book = await prisma.book.create({
        data: { title: 'Original', author: 'A', isbn: 'ISBN002', description: 'd', genre: '小說', price: 200, publishDate: new Date(), publisher: 'P', totalPages: 100 },
      })
      const res = await app.inject({
        method: 'PUT',
        url: `/v1/api/books/${book.bookId}`,
        headers: { authorization: `Bearer ${token}` },
        payload: { title: '更新後的書名', price: 350 },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.data.title).toBe('更新後的書名')
      expect(body.data.price).toBe('350.00')
    })

    it('should return 404 for non-existent book', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/v1/api/books/non-existent-id',
        headers: { authorization: `Bearer ${token}` },
        payload: { title: 'Updated' },
      })
      expect(res.statusCode).toBe(404)
    })
  })

  // ── DELETE /v1/api/books/:bookId ───────────────────────────────────────────
  describe('DELETE /v1/api/books/:bookId', () => {
    it('should return 401 without auth', async () => {
      const book = await prisma.book.create({
        data: { title: 'Test', author: 'A', isbn: 'ISBN003', description: 'd', genre: '小說', price: 200, publishDate: new Date(), publisher: 'P', totalPages: 100 },
      })
      const res = await app.inject({ method: 'DELETE', url: `/v1/api/books/${book.bookId}` })
      expect(res.statusCode).toBe(401)
    })

    it('should delete book with auth', async () => {
      const book = await prisma.book.create({
        data: { title: 'To Delete', author: 'A', isbn: 'ISBN004', description: 'd', genre: '小說', price: 200, publishDate: new Date(), publisher: 'P', totalPages: 100 },
      })
      const res = await app.inject({
        method: 'DELETE',
        url: `/v1/api/books/${book.bookId}`,
        headers: { authorization: `Bearer ${token}` },
      })
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.code).toBe(200)

      const check = await prisma.book.findUnique({ where: { bookId: book.bookId } })
      expect(check).toBeNull()
    })
  })
})
