import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyPluginAsync } from 'fastify';
import { envConfig } from '../config';

const swaggerPlugin: FastifyPluginAsync = async fastify => {
  // Configure Swagger/OpenAPI
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Mugsy: DECAF API',
        description:
          'Does Every Coffee Action, Friend - API for Mugsy coffee machine control and web interface. Includes PIN authentication for touchscreen use.',
        version: '0.1.0',
      },
      schemes:
        envConfig.NODE_ENV === 'production' ? ['https'] : ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  // Only enable Swagger UI in development or staging
  if (envConfig.NODE_ENV !== 'production') {
    await fastify.register(swaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
    });
  }
};

export default fp(swaggerPlugin);
