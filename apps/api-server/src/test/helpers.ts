import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { jwtPlugin } from '../plugins/jwt.js'
import { swaggerPlugin } from '../plugins/swagger.js'
import { authRoutes } from '../routes/auth.js'
import { userRoutes } from '../routes/user.js'
import { gameRoutes } from '../routes/game.js'
import { bookRoutes } from '../routes/book.js'
import { memberLevelRoutes } from '../routes/memberLevel.js'
import { stockRoutes } from '../routes/stock.js'
import { concertRoutes } from '../routes/concert.js'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false,
    ajv: { customOptions: { strict: false } },
  })
  await app.register(cors, { origin: true, credentials: true })
  await app.register(swaggerPlugin)
  await app.register(jwtPlugin)
  await app.register(authRoutes)
  await app.register(userRoutes)
  await app.register(gameRoutes)
  await app.register(bookRoutes)
  await app.register(memberLevelRoutes)
  await app.register(stockRoutes)
  await app.register(concertRoutes)
  app.get('/health', async () => ({ status: 'ok' }))
  await app.ready()
  return app
}

export async function loginAsDemo(app: FastifyInstance): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/v1/api/user/login',
    payload: { email: 'demo@example.com', password: 'password123' },
  })
  const body = JSON.parse(res.body)
  return body.data.token
}
