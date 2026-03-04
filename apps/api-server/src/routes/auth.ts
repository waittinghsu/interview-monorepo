import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
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

export async function authRoutes(app: FastifyInstance) {
  // POST /v1/api/user/login
  app.post('/v1/api/user/login', {
    schema: {
      tags: ['使用者類'],
      summary: '登入',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number' },
            msg: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body as { email: string, password: string }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      ;(reply as any).status(401)
      return { code: 401, msg: '帳號或密碼錯誤', data: null }
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      ;(reply as any).status(401)
      return { code: 401, msg: '帳號或密碼錯誤', data: null }
    }

    const token = app.jwt.sign(
      { memberId: user.memberId, email: user.email, role: user.role },
      { expiresIn: '7d' },
    )

    return { code: 200, msg: 'OK', data: { token, user: formatUser(user) } }
  })

  // POST /v1/api/user/logout
  app.post('/v1/api/user/logout', {
    schema: {
      tags: ['使用者類'],
      summary: '登出',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [(app as any).authenticate],
  }, async (_request, _reply) => {
    return { code: 200, msg: 'OK', data: null }
  })
}
