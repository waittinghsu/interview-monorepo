import type { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export async function swaggerPlugin(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Interview API Server',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })
}
