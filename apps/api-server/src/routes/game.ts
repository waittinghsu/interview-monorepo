import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'

function formatGame(game: any) {
  return {
    gameId: game.gameId,
    title: game.title,
    description: game.description,
    genre: game.genre,
    platform: game.platform,
    rating: game.rating.toFixed(1),
    price: game.price.toFixed(2),
    releaseDate: game.releaseDate.toISOString(),
    developer: game.developer,
    publisher: game.publisher,
    imageUrl: game.imageUrl,
    tags: game.tags,
    isActive: game.isActive,
    createdAt: game.createdAt.toISOString(),
    updatedAt: game.updatedAt.toISOString(),
  }
}

const gameItemSchema = {
  type: 'object',
  properties: {
    gameId: { type: 'string', mock: { mock: '@guid' }, title: '遊戲ID', description: '遊戲唯一識別碼（CUID）' },
    title: { type: 'string', mock: { mock: '薩爾達傳說：王國之淚' }, title: '遊戲名稱', description: '遊戲的完整名稱' },
    description: { type: 'string', mock: { mock: '探索廣大的海拉魯大陸，揭開古老王國的秘密' }, title: '遊戲簡介', description: '遊戲的詳細介紹' },
    genre: { type: 'string', mock: { mock: 'Action-Adventure' }, title: '遊戲類型', description: '遊戲類別，如 RPG、Action、Strategy 等' },
    platform: { type: 'array', items: { type: 'string', mock: { mock: 'Nintendo Switch' } }, title: '支援平台', description: '遊戲支援的遊玩平台列表' },
    rating: { type: 'string', mock: { mock: '9.8' }, title: '評分', description: '遊戲評分，0-10 分制' },
    price: { type: 'string', mock: { mock: '1799.00' }, title: '售價', description: '遊戲定價（新台幣）' },
    releaseDate: { type: 'string', mock: { mock: '2023-05-12T00:00:00.000Z' }, title: '發售日期', description: '遊戲正式發售的日期時間' },
    developer: { type: 'string', mock: { mock: 'Nintendo EPD' }, title: '開發商', description: '遊戲開發公司名稱' },
    publisher: { type: 'string', mock: { mock: 'Nintendo' }, title: '發行商', description: '遊戲發行公司名稱' },
    imageUrl: { type: 'string', mock: { mock: 'https://example.com/game.jpg' }, title: '封面圖片', description: '遊戲封面圖片URL' },
    tags: { type: 'array', items: { type: 'string', mock: { mock: 'open-world' } }, title: '標籤', description: '遊戲相關標籤列表' },
    isActive: { type: 'boolean', mock: { mock: true }, title: '是否上架', description: '遊戲是否處於上架狀態' },
    createdAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '建立時間', description: '資料建立的時間戳' },
    updatedAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '更新時間', description: '資料最後更新的時間戳' },
  },
}

export async function gameRoutes(app: FastifyInstance) {
  // GET /v1/api/games
  app.get('/v1/api/games', {
    schema: {
      tags: ['遊戲類'],
      summary: '獲取-遊戲列表',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1, title: '頁碼', description: '分頁頁碼，從1開始' },
          limit: { type: 'integer', default: 10, title: '每頁筆數', description: '每頁顯示的資料筆數，預設10' },
          genre: { type: 'string', title: '遊戲類型', description: '依遊戲類型篩選' },
          keyword: { type: 'string', title: '關鍵字', description: '依遊戲名稱或描述搜尋' },
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
                list: { type: 'array', items: gameItemSchema, title: '遊戲列表', description: '遊戲資料陣列' },
                total: { type: 'number', mock: { mock: '@natural(1,100)' }, title: '總筆數', description: '符合條件的資料總數' },
                page: { type: 'number', mock: { mock: '1' }, title: '當前頁碼', description: '當前頁碼' },
                limit: { type: 'number', mock: { mock: '10' }, title: '每頁筆數', description: '每頁筆數' },
                totalPages: { type: 'number', mock: { mock: '5' }, title: '總頁數', description: '根據總筆數與每頁筆數計算的總頁數' },
              },
            },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const { page = 1, limit = 10, genre, keyword } = request.query as {
      page?: number
      limit?: number
      genre?: string
      keyword?: string
    }
    const where: any = {}
    if (genre) where.genre = genre
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ]
    }
    const [list, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.game.count({ where }),
    ])
    return {
      code: 200,
      msg: 'OK',
      data: {
        list: list.map(formatGame),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  })

  // POST /v1/api/games
  app.post('/v1/api/games', {
    schema: {
      tags: ['遊戲類'],
      summary: '新增-遊戲',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'description', 'genre', 'platform', 'price', 'releaseDate', 'developer', 'publisher'],
        properties: {
          title: { type: 'string', title: '遊戲名稱', description: '遊戲的完整名稱' },
          description: { type: 'string', title: '遊戲簡介', description: '遊戲詳細介紹' },
          genre: { type: 'string', title: '遊戲類型', description: '遊戲類別' },
          platform: { type: 'array', items: { type: 'string' }, title: '支援平台', description: '遊戲支援的平台列表' },
          rating: { type: 'number', title: '評分', description: '遊戲評分 0-10' },
          price: { type: 'number', title: '售價', description: '遊戲定價（新台幣）' },
          releaseDate: { type: 'string', title: '發售日期', description: 'ISO8601 格式的日期時間字串' },
          developer: { type: 'string', title: '開發商', description: '遊戲開發公司' },
          publisher: { type: 'string', title: '發行商', description: '遊戲發行公司' },
          imageUrl: { type: 'string', title: '封面圖片URL', description: '遊戲封面圖片連結' },
          tags: { type: 'array', items: { type: 'string' }, title: '標籤', description: '遊戲標籤陣列' },
          isActive: { type: 'boolean', title: '上架狀態', description: '是否上架，預設 true' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: gameItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, _reply) => {
    const body = request.body as any
    const game = await prisma.game.create({
      data: {
        title: body.title,
        description: body.description,
        genre: body.genre,
        platform: body.platform,
        rating: body.rating ?? 0,
        price: body.price,
        releaseDate: new Date(body.releaseDate),
        developer: body.developer,
        publisher: body.publisher,
        imageUrl: body.imageUrl ?? '',
        tags: body.tags ?? [],
        isActive: body.isActive ?? true,
      },
    })
    return { code: 200, msg: 'OK', data: formatGame(game) }
  })

  // GET /v1/api/games/:gameId
  app.get('/v1/api/games/:gameId', {
    schema: {
      tags: ['遊戲類'],
      summary: '獲取-遊戲詳情',
      params: {
        type: 'object',
        properties: { gameId: { type: 'string', title: '遊戲ID', description: '遊戲唯一識別碼' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: gameItemSchema,
          },
        },
      },
    },
  }, async (request, reply) => {
    const { gameId } = request.params as { gameId: string }
    const game = await prisma.game.findUnique({ where: { gameId } })
    if (!game) {
      reply.status(404)
      return { code: 404, msg: '遊戲不存在', data: null }
    }
    return { code: 200, msg: 'OK', data: formatGame(game) }
  })

  // PUT /v1/api/games/:gameId
  app.put('/v1/api/games/:gameId', {
    schema: {
      tags: ['遊戲類'],
      summary: '更新-遊戲資訊',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { gameId: { type: 'string', title: '遊戲ID', description: '遊戲唯一識別碼' } },
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', title: '遊戲名稱' },
          description: { type: 'string', title: '遊戲簡介' },
          genre: { type: 'string', title: '遊戲類型' },
          platform: { type: 'array', items: { type: 'string' }, title: '支援平台' },
          rating: { type: 'number', title: '評分' },
          price: { type: 'number', title: '售價' },
          releaseDate: { type: 'string', title: '發售日期' },
          developer: { type: 'string', title: '開發商' },
          publisher: { type: 'string', title: '發行商' },
          imageUrl: { type: 'string', title: '封面圖片URL' },
          tags: { type: 'array', items: { type: 'string' }, title: '標籤' },
          isActive: { type: 'boolean', title: '上架狀態' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: gameItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, reply) => {
    const { gameId } = request.params as { gameId: string }
    const body = request.body as any

    const existing = await prisma.game.findUnique({ where: { gameId } })
    if (!existing) {
      reply.status(404)
      return { code: 404, msg: '遊戲不存在', data: null }
    }

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.genre !== undefined) updateData.genre = body.genre
    if (body.platform !== undefined) updateData.platform = body.platform
    if (body.rating !== undefined) updateData.rating = body.rating
    if (body.price !== undefined) updateData.price = body.price
    if (body.releaseDate !== undefined) updateData.releaseDate = new Date(body.releaseDate)
    if (body.developer !== undefined) updateData.developer = body.developer
    if (body.publisher !== undefined) updateData.publisher = body.publisher
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.isActive !== undefined) updateData.isActive = body.isActive

    const game = await prisma.game.update({ where: { gameId }, data: updateData })
    return { code: 200, msg: 'OK', data: formatGame(game) }
  })

  // DELETE /v1/api/games/:gameId
  app.delete('/v1/api/games/:gameId', {
    schema: {
      tags: ['遊戲類'],
      summary: '刪除-遊戲',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { gameId: { type: 'string', title: '遊戲ID', description: '遊戲唯一識別碼' } },
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
    const { gameId } = request.params as { gameId: string }

    const existing = await prisma.game.findUnique({ where: { gameId } })
    if (!existing) {
      reply.status(404)
      return { code: 404, msg: '遊戲不存在', data: null }
    }

    await prisma.game.delete({ where: { gameId } })
    return { code: 200, msg: '刪除成功', data: null }
  })
}
