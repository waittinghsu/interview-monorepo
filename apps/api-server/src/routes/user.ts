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

export async function userRoutes(app: FastifyInstance) {
  // GET /v1/api/user/info
  app.get('/v1/api/user/info', {
    schema: {
      tags: ['使用者類'],
      summary: '獲取-使用者基本資訊',
      security: [{ bearerAuth: [] }],
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
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['nickname', 'bookmarks', 'email'],
        properties: {
          nickname: { type: 'string' },
          email: { type: 'string', format: 'email' },
          bookmarks: { type: 'array', items: { type: 'number' } },
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
