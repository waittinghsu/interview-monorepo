import type { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'

export async function jwtPlugin(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'default-secret-change-in-production',
  })

  // Decorator: authenticate
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify()
    }
    catch {
      reply.status(401).send({ code: 401, msg: 'Unauthorized', data: null })
    }
  })
}
