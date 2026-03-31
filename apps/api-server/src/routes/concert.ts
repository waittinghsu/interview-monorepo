import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'

function formatConcert(concert: any) {
  return {
    concertId: concert.concertId,
    title: concert.title,
    artist: concert.artist,
    venue: concert.venue,
    organizer: concert.organizer,
    performanceDate: concert.performanceDate.toISOString(),
    saleStartDate: concert.saleStartDate.toISOString(),
    saleEndDate: concert.saleEndDate.toISOString(),
    description: concert.description,
    imageUrl: concert.imageUrl,
    tickets: concert.tickets,
    status: concert.status,
    createdAt: concert.createdAt.toISOString(),
    updatedAt: concert.updatedAt.toISOString(),
  }
}

const venueSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', mock: { mock: '台北小巨蛋' }, title: '場館名稱', description: '演出場館名稱' },
    address: { type: 'string', mock: { mock: '台北市松山區南京東路四段2號' }, title: '場館地址', description: '場館完整地址' },
    city: { type: 'string', mock: { mock: '台北市' }, title: '城市', description: '場館所在城市' },
    capacity: { type: 'number', mock: { mock: '@natural(1000,100000)' }, title: '容納人數', description: '場館最大容納人數' },
  },
}

const ticketSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', mock: { mock: 'VIP' }, title: '票種代碼', description: '票種識別代碼，如 VIP、A、B、C' },
    name: { type: 'string', mock: { mock: 'VIP 座位' }, title: '票種名稱', description: '票種顯示名稱' },
    price: { type: 'string', mock: { mock: '6800' }, title: '票價', description: '票種售價（新台幣）' },
    quantity: { type: 'number', mock: { mock: '@natural(100,5000)' }, title: '總數量', description: '此票種的總張數' },
    available: { type: 'number', mock: { mock: '@natural(0,5000)' }, title: '剩餘數量', description: '此票種的剩餘可購張數' },
  },
}

const concertItemSchema = {
  type: 'object',
  properties: {
    concertId: { type: 'string', mock: { mock: '@guid' }, title: '演唱會ID', description: '演唱會唯一識別碼（CUID）' },
    title: { type: 'string', mock: { mock: 'Jay Chou 魔天倫世界巡迴演唱會' }, title: '演唱會名稱', description: '演唱會完整名稱' },
    artist: { type: 'string', mock: { mock: '周杰倫' }, title: '表演者', description: '表演藝人或樂團名稱' },
    venue: venueSchema,
    organizer: { type: 'string', mock: { mock: '相信音樂' }, title: '主辦單位', description: '演唱會主辦公司或組織' },
    performanceDate: { type: 'string', mock: { mock: '2024-08-15T19:00:00.000Z' }, title: '演出時間', description: '演唱會開始的日期時間（ISO8601）' },
    saleStartDate: { type: 'string', mock: { mock: '2024-06-01T10:00:00.000Z' }, title: '售票開始時間', description: '票券開始販售的時間' },
    saleEndDate: { type: 'string', mock: { mock: '2024-08-14T23:59:59.000Z' }, title: '售票截止時間', description: '票券停止販售的時間' },
    description: { type: 'string', mock: { mock: '周杰倫最新世界巡迴演唱會' }, title: '演唱會說明', description: '演唱會詳細介紹' },
    imageUrl: { type: 'string', mock: { mock: 'https://example.com/concert.jpg' }, title: '海報圖片', description: '演唱會海報圖片URL' },
    tickets: { type: 'array', items: ticketSchema, title: '票券列表', description: '可購買的票種列表' },
    status: { type: 'string', mock: { mock: 'upcoming' }, title: '演唱會狀態', description: '狀態：upcoming=即將開賣, onsale=販售中, soldout=售完, ended=已結束' },
    createdAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '建立時間' },
    updatedAt: { type: 'string', mock: { mock: '2024-01-01T00:00:00.000Z' }, title: '更新時間' },
  },
}

export async function concertRoutes(app: FastifyInstance) {
  // GET /v1/api/concerts
  app.get('/v1/api/concerts', {
    schema: {
      tags: ['演唱會類'],
      summary: '獲取-演唱會列表',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1, title: '頁碼', description: '分頁頁碼' },
          limit: { type: 'integer', default: 10, title: '每頁筆數', description: '每頁顯示筆數' },
          status: { type: 'string', title: '狀態篩選', description: '依演唱會狀態篩選：upcoming, onsale, soldout, ended' },
          keyword: { type: 'string', title: '關鍵字', description: '依演唱會名稱或藝人搜尋' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼', description: '200 表示成功' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: {
              type: 'object',
              properties: {
                list: { type: 'array', items: concertItemSchema, title: '演唱會列表' },
                total: { type: 'number', mock: { mock: '@natural(1,50)' }, title: '總筆數' },
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
    const { page = 1, limit = 10, status, keyword } = request.query as {
      page?: number
      limit?: number
      status?: string
      keyword?: string
    }
    const where: any = {}
    if (status) where.status = status
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { artist: { contains: keyword, mode: 'insensitive' } },
      ]
    }
    const [list, total] = await Promise.all([
      prisma.concert.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { performanceDate: 'asc' },
      }),
      prisma.concert.count({ where }),
    ])
    return {
      code: 200,
      msg: 'OK',
      data: {
        list: list.map(formatConcert),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  })

  // POST /v1/api/concerts
  app.post('/v1/api/concerts', {
    schema: {
      tags: ['演唱會類'],
      summary: '新增-演唱會',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'artist', 'venue', 'organizer', 'performanceDate', 'saleStartDate', 'saleEndDate', 'description', 'tickets'],
        properties: {
          title: { type: 'string', title: '演唱會名稱' },
          artist: { type: 'string', title: '表演者' },
          venue: {
            type: 'object',
            title: '場館資訊',
            description: '演出場館的詳細資訊',
            properties: {
              name: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              capacity: { type: 'number' },
            },
          },
          organizer: { type: 'string', title: '主辦單位' },
          performanceDate: { type: 'string', title: '演出時間' },
          saleStartDate: { type: 'string', title: '售票開始時間' },
          saleEndDate: { type: 'string', title: '售票截止時間' },
          description: { type: 'string', title: '演唱會說明' },
          imageUrl: { type: 'string', title: '海報URL' },
          tickets: {
            type: 'array',
            title: '票券列表',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                name: { type: 'string' },
                price: { type: 'string' },
                quantity: { type: 'number' },
                available: { type: 'number' },
              },
            },
          },
          status: { type: 'string', title: '狀態', description: 'upcoming | onsale | soldout | ended' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: concertItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, _reply) => {
    const body = request.body as any
    const concert = await prisma.concert.create({
      data: {
        title: body.title,
        artist: body.artist,
        venue: body.venue,
        organizer: body.organizer,
        performanceDate: new Date(body.performanceDate),
        saleStartDate: new Date(body.saleStartDate),
        saleEndDate: new Date(body.saleEndDate),
        description: body.description,
        imageUrl: body.imageUrl ?? '',
        tickets: body.tickets,
        status: body.status ?? 'upcoming',
      },
    })
    return { code: 200, msg: 'OK', data: formatConcert(concert) }
  })

  // GET /v1/api/concerts/:concertId
  app.get('/v1/api/concerts/:concertId', {
    schema: {
      tags: ['演唱會類'],
      summary: '獲取-演唱會詳情',
      params: {
        type: 'object',
        properties: { concertId: { type: 'string', title: '演唱會ID' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: concertItemSchema,
          },
        },
      },
    },
  }, async (request, reply) => {
    const { concertId } = request.params as { concertId: string }
    const concert = await prisma.concert.findUnique({ where: { concertId } })
    if (!concert) {
      return (reply as any).status(404).send({ code: 404, msg: '演唱會不存在', data: null })
    }
    return { code: 200, msg: 'OK', data: formatConcert(concert) }
  })

  // PUT /v1/api/concerts/:concertId
  app.put('/v1/api/concerts/:concertId', {
    schema: {
      tags: ['演唱會類'],
      summary: '更新-演唱會資訊',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { concertId: { type: 'string', title: '演唱會ID' } },
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', title: '演唱會名稱' },
          artist: { type: 'string', title: '表演者' },
          venue: { type: 'object', title: '場館資訊', additionalProperties: true },
          organizer: { type: 'string', title: '主辦單位' },
          performanceDate: { type: 'string', title: '演出時間' },
          saleStartDate: { type: 'string', title: '售票開始時間' },
          saleEndDate: { type: 'string', title: '售票截止時間' },
          description: { type: 'string', title: '演唱會說明' },
          imageUrl: { type: 'string', title: '海報URL' },
          tickets: { type: 'array', items: { type: 'object', additionalProperties: true }, title: '票券列表' },
          status: { type: 'string', title: '狀態' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: concertItemSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, reply) => {
    const { concertId } = request.params as { concertId: string }
    const body = request.body as any

    const existing = await prisma.concert.findUnique({ where: { concertId } })
    if (!existing) {
      return (reply as any).status(404).send({ code: 404, msg: '演唱會不存在', data: null })
    }

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.artist !== undefined) updateData.artist = body.artist
    if (body.venue !== undefined) updateData.venue = body.venue
    if (body.organizer !== undefined) updateData.organizer = body.organizer
    if (body.performanceDate !== undefined) updateData.performanceDate = new Date(body.performanceDate)
    if (body.saleStartDate !== undefined) updateData.saleStartDate = new Date(body.saleStartDate)
    if (body.saleEndDate !== undefined) updateData.saleEndDate = new Date(body.saleEndDate)
    if (body.description !== undefined) updateData.description = body.description
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.tickets !== undefined) updateData.tickets = body.tickets
    if (body.status !== undefined) updateData.status = body.status

    const concert = await prisma.concert.update({ where: { concertId }, data: updateData })
    return { code: 200, msg: 'OK', data: formatConcert(concert) }
  })

  // DELETE /v1/api/concerts/:concertId
  app.delete('/v1/api/concerts/:concertId', {
    schema: {
      tags: ['演唱會類'],
      summary: '刪除-演唱會',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { concertId: { type: 'string', title: '演唱會ID' } },
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
    const { concertId } = request.params as { concertId: string }

    const existing = await prisma.concert.findUnique({ where: { concertId } })
    if (!existing) {
      return (reply as any).status(404).send({ code: 404, msg: '演唱會不存在', data: null })
    }

    await prisma.concert.delete({ where: { concertId } })
    return { code: 200, msg: '刪除成功', data: null }
  })
}
