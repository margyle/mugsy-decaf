import { FastifyInstance } from 'fastify';
import * as handlers from './handlers';
import {
  loginSchema,
  registerSchema,
  userResponseSchema,
  authResponseSchema,
  errorResponseSchema,
} from './schema';

export default async function authRoutes(fastify: FastifyInstance) {
  // Register schemas
  fastify.addSchema(loginSchema);
  fastify.addSchema(registerSchema);
  fastify.addSchema(userResponseSchema);
  fastify.addSchema(authResponseSchema);
  fastify.addSchema(errorResponseSchema);

  // Login route
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      body: { $ref: 'login#' },
      response: {
        200: { $ref: 'authResponse#' },
        401: { $ref: 'authErrorResponse#' },
      },
    },
    handler: handlers.loginHandler,
  });

  // Register route
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: { $ref: 'register#' },
      response: {
        201: { $ref: 'userResponse#' },
        409: { $ref: 'authErrorResponse#' },
        500: { $ref: 'authErrorResponse#' },
      },
    },
    handler: handlers.registerHandler,
  });
}
