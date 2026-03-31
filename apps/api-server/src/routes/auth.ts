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

const userSchema = {
  type: 'object',
  properties: {
    memberId: { type: 'string', mock: { mock: '@natural' }, title: '用戶代號', description: '用戶唯一識別碼（CUID）' },
    name: { type: 'string', mock: { mock: '愛新覺羅' }, title: '真實姓名', description: '用戶的真實姓名' },
    nickname: { type: 'string', mock: { mock: 'omega' }, title: '暱稱', description: '用戶的顯示暱稱' },
    phone: { type: 'string', mock: { mock: '0909000000' }, title: '手機號碼', description: '用戶手機號碼（台灣格式 09xxxxxxxx）' },
    email: { type: 'string', mock: { mock: 'omega@yapi.com' }, title: '電子信箱', description: '用戶電子郵件地址' },
    level: { type: 'number', mock: { mock: '@natural(1,12)' }, title: '會員等級', description: '會員等級編號，對應 MemberLevel 的 levelId' },
    avatarId: { type: 'number', mock: { mock: '@natural(1,12)' }, title: '頭像編號', description: '用戶選擇的頭像編號，範圍 1-14' },
    role: { type: 'string', mock: { mock: 'member' }, title: '角色', description: '用戶角色：super（超管）、admin（管理員）、member（一般會員）、noob（新手）' },
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

export async function authRoutes(app: FastifyInstance) {
  // POST /v1/api/user/login
  app.post('/v1/api/user/login', {
    schema: {
      tags: ['使用者類'],
      summary: '登入',
      description: '使用電子信箱與密碼進行身份驗證，成功後返回 JWT token 與用戶資訊',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            mock: { mock: 'demo@example.com' },
            title: '電子信箱',
            description: '用戶登入的電子郵件地址',
          },
          password: {
            type: 'string',
            minLength: 6,
            mock: { mock: 'password123' },
            title: '密碼',
            description: '用戶密碼，至少6個字元',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼', description: '200 表示登入成功，401 表示帳號或密碼錯誤' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息', description: '操作結果描述' },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  mock: { mock: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example' },
                  title: 'JWT Token',
                  description: 'JSON Web Token，用於後續 API 請求的身份驗證，有效期 7 天',
                },
                user: userSchema,
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
      description: '登出當前用戶（前端清除 token 即可，後端記錄登出事件）',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number', mock: { mock: '200' }, title: '商業邏輯驗證碼', description: '200 表示登出成功' },
            msg: { type: 'string', mock: { mock: 'OK' }, title: 'API 訊息' },
            data: { type: 'null', title: '資料', description: '登出無返回資料' },
          },
        },
      },
    },
    preHandler: [(app as any).authenticate],
  }, async (_request, _reply) => {
    return { code: 200, msg: 'OK', data: null }
  })
}
