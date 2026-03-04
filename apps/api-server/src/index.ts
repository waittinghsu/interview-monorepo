import cors from '@fastify/cors'
import Fastify from 'fastify'
import { jwtPlugin } from './plugins/jwt.js'
import { swaggerPlugin } from './plugins/swagger.js'
import { authRoutes } from './routes/auth.js'
import { userRoutes } from './routes/user.js'

const app = Fastify({ logger: true })

async function bootstrap() {
  // CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
  })

  // Swagger
  await app.register(swaggerPlugin)

  // JWT
  await app.register(jwtPlugin)

  // Routes
  await app.register(authRoutes)
  await app.register(userRoutes)

  // Health check
  app.get('/health', async () => ({ status: 'ok' }))

  const port = parseInt(process.env.WEB_PORT ?? process.env.PORT ?? '3000', 10)
  const host = process.env.HOST ?? '0.0.0.0'

  await app.listen({ port, host })
  console.log(`API Server running at http://${host}:${port}`)
  console.log(`Swagger UI at http://${host}:${port}/docs`)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
