import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'

function formatMemberLevel(level: any) {
  return {
    levelId: level.levelId,
    name: level.name,
    minPoints: level.minPoints,
    maxPoints: level.maxPoints,
    discount: level.discount.toFixed(2),
    benefits: level.benefits,
    badgeUrl: level.badgeUrl,
    createdAt: level.createdAt.toISOString(),
    updatedAt: level.updatedAt.toISOString(),
  }
}

const memberLevelItemSchema = {
  type: 'object',
  properties: {
    levelId: { type: 'number', mock: { mock: '@natural(1,10)' }, title: '等級編號', description: '會員等級編號，由小到大代表等級由低到高' },
    name: { type: 'string', mock: { mock: '黃金會員' }, title: '等級名稱', description: '會員等級的顯示名稱' },
    minPoints: { type: 'number', mock: { mock: '@natural(0,10000)' }, title: '最低點數', description: '達到此等級所需的最低累積點數' },
    maxPoints: { type: 'number', mock: { mock: '@natural(10000,99999)' }, title: '最高點數', description: '此等級的最高點數上限（-1 表示無上限）' },
    discount: { type: 'string', mock: { mock: '0.85' }, title: '折扣率', description: '此等級會員的消費折扣率，1.00 表示無折扣' },
    benefits: { type: 'array', items: { type: 'string', mock: { mock: '生日禮券' } }, title: '會員福利', description: '此等級專屬的會員福利列表' },
    badgeUrl: { type: 'string', mock: { mock: 'https://example.com/badge-gold.png' }, title: '等級徽章', description: '此等級徽章圖片URL' },
    createdAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '建立時間', description: '資料建立的時間戳' },
    updatedAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '更新時間', description: '資料最後更新的時間戳' },
  },
}

export async function memberLevelRoutes(app: FastifyInstance) {
  // GET /v1/api/member-levels
  app.get('/v1/api/member-levels', {
    schema: {
      tags: ['會員等級類'],
      summary: '獲取-會員等級列表',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1, title: '頁碼', description: '分頁頁碼' },
          limit: { type: 'integer', default: 20, title: '每頁筆數', description: '每頁筆數，預設20（等級數量通常不多）' },
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
                list: { type: 'array', items: memberLevelItemSchema, title: '等級列表', description: '會員等級資料陣列，依 levelId 升序排列' },
                total: { type: 'number', mock: { mock: '@natural(1,10)' }, title: '總筆數', description: '會員等級總數' },
                page: { type: 'number', mock: { mock: '1' }, title: '當前頁碼' },
                limit: { type: 'number', mock: { mock: '20' }, title: '每頁筆數' },
                totalPages: { type: 'number', mock: { mock: '1' }, title: '總頁數' },
              },
            },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const { page = 1, limit = 20 } = request.query as { page?: number, limit?: number }
    const [list, total] = await Promise.all([
      prisma.memberLevel.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { levelId: 'asc' },
      }),
      prisma.memberLevel.count(),
    ])
    return {
      code: 200,
      msg: 'OK',
      data: {
        list: list.map(formatMemberLevel),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  })

  // POST /v1/api/member-levels
  app.post('/v1/api/member-levels', {
    schema: {
      tags: ['會員等級類'],
      summary: '新增-會員等級',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['levelId', 'name', 'minPoints', 'maxPoints'],
        properties: {
          levelId: { type: 'integer', title: '等級編號', description: '唯一的等級編號，從1開始' },
          name: { type: 'string', title: '等級名稱', description: '會員等級顯示名稱' },
          minPoints: { type: 'integer', title: '最低點數', description: '達到此等級的最低點數門檻' },
          maxPoints: { type: 'integer', title: '最高點數', description: '此等級的最高點數上限' },
          discount: { type: 'number', title: '折扣率', description: '消費折扣率，1.00 = 無折扣，0.85 = 85折' },
          benefits: { type: 'array', items: { type: 'string' }, title: '會員福利', description: '此等級會員福利列表' },
          badgeUrl: { type: 'string', title: '徽章URL', description: '等級徽章圖片連結' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: memberLevelItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, _reply) => {
    const body = request.body as any
    const level = await prisma.memberLevel.create({
      data: {
        levelId: body.levelId,
        name: body.name,
        minPoints: body.minPoints,
        maxPoints: body.maxPoints,
        discount: body.discount ?? 1.00,
        benefits: body.benefits ?? [],
        badgeUrl: body.badgeUrl ?? '',
      },
    })
    return { code: 200, msg: 'OK', data: formatMemberLevel(level) }
  })

  // GET /v1/api/member-levels/:levelId
  app.get('/v1/api/member-levels/:levelId', {
    schema: {
      tags: ['會員等級類'],
      summary: '獲取-會員等級詳情',
      params: {
        type: 'object',
        properties: { levelId: { type: 'integer', title: '等級編號', description: '會員等級編號' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: memberLevelItemSchema,
          },
        },
      },
    },
  }, async (request, reply) => {
    const { levelId } = request.params as { levelId: number }
    const level = await prisma.memberLevel.findUnique({ where: { levelId: Number(levelId) } })
    if (!level) {
      return (reply as any).status(404).send({ code: 404, msg: '會員等級不存在', data: null })
    }
    return { code: 200, msg: 'OK', data: formatMemberLevel(level) }
  })

  // PUT /v1/api/member-levels/:levelId
  app.put('/v1/api/member-levels/:levelId', {
    schema: {
      tags: ['會員等級類'],
      summary: '更新-會員等級',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { levelId: { type: 'integer', title: '等級編號' } },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', title: '等級名稱' },
          minPoints: { type: 'integer', title: '最低點數' },
          maxPoints: { type: 'integer', title: '最高點數' },
          discount: { type: 'number', title: '折扣率' },
          benefits: { type: 'array', items: { type: 'string' }, title: '會員福利' },
          badgeUrl: { type: 'string', title: '徽章URL' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: memberLevelItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, reply) => {
    const { levelId } = request.params as { levelId: number }
    const body = request.body as any

    const existing = await prisma.memberLevel.findUnique({ where: { levelId: Number(levelId) } })
    if (!existing) {
      return (reply as any).status(404).send({ code: 404, msg: '會員等級不存在', data: null })
    }

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.minPoints !== undefined) updateData.minPoints = body.minPoints
    if (body.maxPoints !== undefined) updateData.maxPoints = body.maxPoints
    if (body.discount !== undefined) updateData.discount = body.discount
    if (body.benefits !== undefined) updateData.benefits = body.benefits
    if (body.badgeUrl !== undefined) updateData.badgeUrl = body.badgeUrl

    const level = await prisma.memberLevel.update({
      where: { levelId: Number(levelId) },
      data: updateData,
    })
    return { code: 200, msg: 'OK', data: formatMemberLevel(level) }
  })

  // DELETE /v1/api/member-levels/:levelId
  app.delete('/v1/api/member-levels/:levelId', {
    schema: {
      tags: ['會員等級類'],
      summary: '刪除-會員等級',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { levelId: { type: 'integer', title: '等級編號' } },
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
    const { levelId } = request.params as { levelId: number }

    const existing = await prisma.memberLevel.findUnique({ where: { levelId: Number(levelId) } })
    if (!existing) {
      return (reply as any).status(404).send({ code: 404, msg: '會員等級不存在', data: null })
    }

    await prisma.memberLevel.delete({ where: { levelId: Number(levelId) } })
    return { code: 200, msg: '刪除成功', data: null }
  })
}
