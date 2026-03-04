import type { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fp from 'fastify-plugin'

async function jwtPluginFn(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'default-secret-change-in-production',
  })

  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify()
    }
    catch {
      reply.status(401).send({ code: 401, msg: 'Unauthorized', data: null })
    }
  })
}

export const jwtPlugin = fp(jwtPluginFn)
