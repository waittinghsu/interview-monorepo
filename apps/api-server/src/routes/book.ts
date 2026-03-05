import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'

function formatBook(book: any) {
  return {
    bookId: book.bookId,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    description: book.description,
    genre: book.genre,
    price: book.price.toFixed(2),
    publishDate: book.publishDate.toISOString(),
    publisher: book.publisher,
    totalPages: book.totalPages,
    language: book.language,
    coverUrl: book.coverUrl,
    rating: book.rating.toFixed(1),
    inStock: book.inStock,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  }
}

const bookItemSchema = {
  type: 'object',
  properties: {
    bookId: { type: 'string', mock: { mock: '@guid' }, title: '書籍ID', description: '書籍唯一識別碼（CUID）' },
    title: { type: 'string', mock: { mock: '三體' }, title: '書名', description: '書籍完整名稱' },
    author: { type: 'string', mock: { mock: '劉慈欣' }, title: '作者', description: '書籍作者姓名' },
    isbn: { type: 'string', mock: { mock: '9789571375700' }, title: 'ISBN', description: '國際標準書號（ISBN-13）' },
    description: { type: 'string', mock: { mock: '中國科幻小說的巔峰之作' }, title: '書籍簡介', description: '書籍的詳細介紹與摘要' },
    genre: { type: 'string', mock: { mock: '科幻' }, title: '書籍類型', description: '書籍分類，如科幻、歷史、商業等' },
    price: { type: 'string', mock: { mock: '380.00' }, title: '定價', description: '書籍定價（新台幣）' },
    publishDate: { type: 'string', mock: { mock: '2008-05-01T00:00:00.000Z' }, title: '出版日期', description: '書籍出版的日期時間' },
    publisher: { type: 'string', mock: { mock: '大田出版' }, title: '出版社', description: '書籍出版社名稱' },
    totalPages: { type: 'number', mock: { mock: '@natural(50,800)' }, title: '總頁數', description: '書籍總頁數' },
    language: { type: 'string', mock: { mock: 'zh-TW' }, title: '語言', description: '書籍語言，如 zh-TW、zh-CN、en' },
    coverUrl: { type: 'string', mock: { mock: 'https://example.com/cover.jpg' }, title: '封面圖片', description: '書籍封面圖片URL' },
    rating: { type: 'string', mock: { mock: '9.5' }, title: '評分', description: '書籍評分，0-10 分制' },
    inStock: { type: 'boolean', mock: { mock: true }, title: '庫存狀態', description: '書籍是否有庫存' },
    createdAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '建立時間', description: '資料建立的時間戳' },
    updatedAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '更新時間', description: '資料最後更新的時間戳' },
  },
}

export async function bookRoutes(app: FastifyInstance) {
  // GET /v1/api/books
  app.get('/v1/api/books', {
    schema: {
      tags: ['書籍類'],
      summary: '獲取-書籍列表',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1, title: '頁碼', description: '分頁頁碼，從1開始' },
          limit: { type: 'integer', default: 10, title: '每頁筆數', description: '每頁顯示的資料筆數' },
          genre: { type: 'string', title: '書籍類型', description: '依書籍類型篩選' },
          keyword: { type: 'string', title: '關鍵字', description: '依書名或作者搜尋' },
          inStock: { type: 'boolean', title: '庫存篩選', description: '是否只顯示有庫存的書籍' },
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
                list: { type: 'array', items: bookItemSchema, title: '書籍列表', description: '書籍資料陣列' },
                total: { type: 'number', mock: { mock: '@natural(1,50)' }, title: '總筆數', description: '符合條件的書籍總數' },
                page: { type: 'number', mock: { mock: '1' }, title: '當前頁碼' },
                limit: { type: 'number', mock: { mock: '10' }, title: '每頁筆數' },
                totalPages: { type: 'number', mock: { mock: '3' }, title: '總頁數' },
              },
            },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const { page = 1, limit = 10, genre, keyword, inStock } = request.query as {
      page?: number
      limit?: number
      genre?: string
      keyword?: string
      inStock?: boolean
    }
    const where: any = {}
    if (genre) where.genre = genre
    if (inStock !== undefined) where.inStock = inStock
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { author: { contains: keyword, mode: 'insensitive' } },
      ]
    }
    const [list, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count({ where }),
    ])
    return {
      code: 200,
      msg: 'OK',
      data: {
        list: list.map(formatBook),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  })

  // POST /v1/api/books
  app.post('/v1/api/books', {
    schema: {
      tags: ['書籍類'],
      summary: '新增-書籍',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'author', 'isbn', 'description', 'genre', 'price', 'publishDate', 'publisher', 'totalPages'],
        properties: {
          title: { type: 'string', title: '書名', description: '書籍完整名稱' },
          author: { type: 'string', title: '作者', description: '書籍作者姓名' },
          isbn: { type: 'string', title: 'ISBN', description: '國際標準書號' },
          description: { type: 'string', title: '書籍簡介', description: '書籍詳細介紹' },
          genre: { type: 'string', title: '書籍類型', description: '書籍分類' },
          price: { type: 'number', title: '定價', description: '書籍定價' },
          publishDate: { type: 'string', title: '出版日期', description: 'ISO8601 格式日期' },
          publisher: { type: 'string', title: '出版社', description: '出版社名稱' },
          totalPages: { type: 'integer', title: '總頁數', description: '書籍總頁數' },
          language: { type: 'string', title: '語言', description: '書籍語言代碼，預設 zh-TW' },
          coverUrl: { type: 'string', title: '封面URL', description: '書籍封面圖片連結' },
          rating: { type: 'number', title: '評分', description: '書籍評分 0-10' },
          inStock: { type: 'boolean', title: '庫存狀態', description: '是否有庫存' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: bookItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, _reply) => {
    const body = request.body as any
    const book = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        description: body.description,
        genre: body.genre,
        price: body.price,
        publishDate: new Date(body.publishDate),
        publisher: body.publisher,
        totalPages: body.totalPages,
        language: body.language ?? 'zh-TW',
        coverUrl: body.coverUrl ?? '',
        rating: body.rating ?? 0,
        inStock: body.inStock ?? true,
      },
    })
    return { code: 200, msg: 'OK', data: formatBook(book) }
  })

  // GET /v1/api/books/:bookId
  app.get('/v1/api/books/:bookId', {
    schema: {
      tags: ['書籍類'],
      summary: '獲取-書籍詳情',
      params: {
        type: 'object',
        properties: { bookId: { type: 'string', title: '書籍ID', description: '書籍唯一識別碼' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: bookItemSchema,
          },
        },
      },
    },
  }, async (request, reply) => {
    const { bookId } = request.params as { bookId: string }
    const book = await prisma.book.findUnique({ where: { bookId } })
    if (!book) {
      reply.status(404)
      return { code: 404, msg: '書籍不存在', data: null }
    }
    return { code: 200, msg: 'OK', data: formatBook(book) }
  })

  // PUT /v1/api/books/:bookId
  app.put('/v1/api/books/:bookId', {
    schema: {
      tags: ['書籍類'],
      summary: '更新-書籍資訊',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { bookId: { type: 'string', title: '書籍ID' } },
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', title: '書名' },
          author: { type: 'string', title: '作者' },
          isbn: { type: 'string', title: 'ISBN' },
          description: { type: 'string', title: '書籍簡介' },
          genre: { type: 'string', title: '書籍類型' },
          price: { type: 'number', title: '定價' },
          publishDate: { type: 'string', title: '出版日期' },
          publisher: { type: 'string', title: '出版社' },
          totalPages: { type: 'integer', title: '總頁數' },
          language: { type: 'string', title: '語言' },
          coverUrl: { type: 'string', title: '封面URL' },
          rating: { type: 'number', title: '評分' },
          inStock: { type: 'boolean', title: '庫存狀態' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: bookItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, reply) => {
    const { bookId } = request.params as { bookId: string }
    const body = request.body as any

    const existing = await prisma.book.findUnique({ where: { bookId } })
    if (!existing) {
      reply.status(404)
      return { code: 404, msg: '書籍不存在', data: null }
    }

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.author !== undefined) updateData.author = body.author
    if (body.isbn !== undefined) updateData.isbn = body.isbn
    if (body.description !== undefined) updateData.description = body.description
    if (body.genre !== undefined) updateData.genre = body.genre
    if (body.price !== undefined) updateData.price = body.price
    if (body.publishDate !== undefined) updateData.publishDate = new Date(body.publishDate)
    if (body.publisher !== undefined) updateData.publisher = body.publisher
    if (body.totalPages !== undefined) updateData.totalPages = body.totalPages
    if (body.language !== undefined) updateData.language = body.language
    if (body.coverUrl !== undefined) updateData.coverUrl = body.coverUrl
    if (body.rating !== undefined) updateData.rating = body.rating
    if (body.inStock !== undefined) updateData.inStock = body.inStock

    const book = await prisma.book.update({ where: { bookId }, data: updateData })
    return { code: 200, msg: 'OK', data: formatBook(book) }
  })

  // DELETE /v1/api/books/:bookId
  app.delete('/v1/api/books/:bookId', {
    schema: {
      tags: ['書籍類'],
      summary: '刪除-書籍',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { bookId: { type: 'string', title: '書籍ID' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: '刪除成功' }, title: 'API 訊息' },
            data: { type: 'null' },
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, reply) => {
    const { bookId } = request.params as { bookId: string }

    const existing = await prisma.book.findUnique({ where: { bookId } })
    if (!existing) {
      reply.status(404)
      return { code: 404, msg: '書籍不存在', data: null }
    }

    await prisma.book.delete({ where: { bookId } })
    return { code: 200, msg: '刪除成功', data: null }
  })
}
