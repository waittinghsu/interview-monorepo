import type { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma.js'

function formatUser(user: any) {
  return {
    memberId: user.memberId,
    name: user.name,
    nickname: user.nickname,
    phone: user.phone,
    email: user.email,
    level: user.level,
    avatarId: user.avatarId,
    role: user.role,
    balance: user.balance.toString(),
    bookmarks: user.bookmarks,
  }
}

const userSchema = {
  type: 'object',
  properties: {
    memberId: { type: 'string', mock: { mock: '@natural' }, title: '用戶代號', description: '用戶唯一識別碼（CUID）' },
    name: { type: 'string', mock: { mock: '愛新覺羅' }, title: '真實姓名', description: '用戶的真實姓名' },
    nickname: { type: 'string', mock: { mock: 'oemga' }, title: '暱稱', description: '用戶的顯示暱稱' },
    phone: { type: 'string', mock: { mock: '0909000000' }, title: '手機號碼', description: '用戶手機號碼（台灣格式 09xxxxxxxx）' },
    email: { type: 'string', mock: { mock: 'omega@yapi.com' }, title: '電子信箱', description: '用戶電子郵件地址' },
    level: { type: 'number', mock: { mock: '@natural(1,12)' }, title: '會員等級', description: '會員等級 1~13，對應 MemberLevel 的 levelId' },
    avatarId: { type: 'number', mock: { mock: '@natural(1,12)' }, title: '頭像編號', description: '用戶選擇的頭像編號 1~14號' },
    role: { type: 'string', mock: { mock: 'super' }, title: '角色', description: '角色, super , admin ,user,noob' },
    balance: { type: 'string', mock: { mock: '258147.39' }, title: '帳戶餘額', description: '用戶帳戶餘額（新台幣），以字串形式返回避免精度損失' },
    bookmarks: {
      type: 'array',
      items: { type: 'number', mock: { mock: '@natural(1,999)' } },
      minItems: 5,
      maxItems: 10,
      title: '書籤列表',
      description: '用戶收藏的項目ID列表，最少5個最多10個',
    },
  },
}

export async function userRoutes(app: FastifyInstance) {
  // GET /v1/api/user/info
  app.get('/v1/api/user/info', {
    schema: {
      tags: ['使用者類'],
      summary: '獲取-使用者基本資訊',
      description: '根據 JWT token 取得當前登入用戶的完整資料，並自動刷新 token',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          title: 'title',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼', description: '商業邏輯驗證碼 comment' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'api訊息', description: 'api訊息' },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  mock: { mock: 'cvq46bwoi2nd1nnpi' },
                  title: '通行證',
                  description: '刷新後的 JWT Token，有效期 7 天，請存儲並用於後續請求',
                },
                user: userSchema,
              },
            },
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, reply) => {
    const payload = (request as any).user as { memberId: string }

    const user = await prisma.user.findUnique({ where: { memberId: payload.memberId } })
    if (!user) {
      reply.status(404)
      return { code: 404, msg: '用戶不存在', data: null }
    }

    // Re-sign token (refresh)
    const token = app.jwt.sign(
      { memberId: user.memberId, email: user.email, role: user.role },
      { expiresIn: '7d' },
    )

    return { code: 200, msg: 'OK', data: { token, user: formatUser(user) } }
  })

  // PUT /v1/api/user/info
  app.put('/v1/api/user/info', {
    schema: {
      tags: ['使用者類'],
      summary: '更新-使用者資訊',
      description: '更新當前登入用戶的暱稱、電子信箱與書籤列表',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['nickname', 'bookmarks', 'email'],
        properties: {
          nickname: {
            type: 'string',
            mock: { mock: 'omega' },
            title: '暱稱',
            description: '用戶的顯示暱稱',
          },
          email: {
            type: 'string',
            format: 'email',
            mock: { mock: 'kira@yamato.com' },
            title: '電子信箱',
            description: '用戶的電子郵件地址',
          },
          bookmarks: {
            type: 'array',
            items: { type: 'number', mock: { mock: '@natural(123,12391293)' } },
            minItems: 5,
            maxItems: 10,
            title: '書籤列表',
            description: '用戶收藏的項目ID列表，最少5個最多10個',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼', description: '200 表示更新成功' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: userSchema,
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (request, reply) => {
    const payload = (request as any).user as { memberId: string }
    const { nickname, email, bookmarks } = request.body as {
      nickname: string
      email: string
      bookmarks: number[]
    }

    const user = await prisma.user.update({
      where: { memberId: payload.memberId },
      data: { nickname, email, bookmarks },
    })

    return { code: 200, msg: 'OK', data: formatUser(user) }
  })
}
