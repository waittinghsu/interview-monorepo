import { delay, http, HttpResponse } from 'msw'

// 模擬用戶資料庫
const users = [
  { id: 1, email: 'admin@example.com', password: 'admin123', name: '管理員', role: 'admin' },
  { id: 2, email: 'user@example.com', password: 'user123', name: '測試用戶', role: 'user' },
]

// 模擬 token（實際應用中會用 JWT）
function generateToken(userId) {
  return `mock-token-${userId}-${Date.now()}`
}

export const userHandlers = [
  // 登入（Swagger 規格：POST /v1/api/user/login）
  http.post('/v1/api/user/login', async ({ request }) => {
    await delay(500) // 模擬網路延遲

    const body = await request.json()
    const { email, password } = body

    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return HttpResponse.json({
        code: '401',
        msg: '帳號或密碼錯誤',
        data: null,
      }, { status: 200 }) // Business error 仍然回 200
    }

    const { password: _, ...userWithoutPassword } = user

    // Business response format
    return HttpResponse.json({
      code: '200',
      msg: 'OK',
      data: {
        token: generateToken(user.id),
        user: userWithoutPassword,
      },
    })
  }),

  // 註冊
  http.post('/api/auth/register', async ({ request }) => {
    await delay(500)

    const body = await request.json()
    const { email, password, name } = body

    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return HttpResponse.json(
        { message: '此 Email 已被註冊' },
        { status: 400 },
      )
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      role: 'user',
    }
    users.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser

    return HttpResponse.json({
      token: generateToken(newUser.id),
      user: userWithoutPassword,
    })
  }),

  // 取得用戶資料（Swagger 規格：GET /v1/api/user/info）
  http.get('/v1/api/user/info', async ({ request }) => {
    await delay(300)

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json(
        { message: '未授權' },
        { status: 401 },
      )
    }

    // 從 token 中取得用戶 ID（模擬）
    const tokenMatch = authHeader.match(/mock-token-(\d+)/)
    if (!tokenMatch) {
      return HttpResponse.json(
        { message: 'Token 無效' },
        { status: 401 },
      )
    }

    const userId = Number.parseInt(tokenMatch[1])
    const user = users.find(u => u.id === userId)

    if (!user) {
      return HttpResponse.json({
        code: '404',
        msg: '用戶不存在',
        data: null,
      }, { status: 200 })
    }

    const { password: _, ...userWithoutPassword } = user
    return HttpResponse.json({
      code: '200',
      msg: 'OK',
      data: userWithoutPassword,
    })
  }),

  // 更新用戶資料
  http.put('/api/user/profile', async ({ request }) => {
    await delay(300)

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json(
        { message: '未授權' },
        { status: 401 },
      )
    }

    const body = await request.json()
    const tokenMatch = authHeader.match(/mock-token-(\d+)/)
    const userId = Number.parseInt(tokenMatch[1])
    const userIndex = users.findIndex(u => u.id === userId)

    if (userIndex === -1) {
      return HttpResponse.json(
        { message: '用戶不存在' },
        { status: 404 },
      )
    }

    users[userIndex] = { ...users[userIndex], ...body }
    const { password: _, ...userWithoutPassword } = users[userIndex]

    return HttpResponse.json(userWithoutPassword)
  }),

  // 登出（Swagger 規格：POST /v1/api/user/logout）
  http.post('/v1/api/user/logout', async () => {
    await delay(200)
    return HttpResponse.json({
      code: '200',
      msg: '登出成功',
      data: null,
    })
  }),
]