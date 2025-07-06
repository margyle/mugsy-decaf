import { FastifyInstance } from 'fastify';
import * as handlers from './handlers';
import {
  userPreferencesSchema,
  userPreferencesResponseSchema,
  errorResponseSchema,
  createUserPreferencesBodySchema,
  updateUserPreferencesBodySchema,
} from './schema';

type FastifyInstanceWithAuth = FastifyInstance & {
  authenticate: any;
  authorizeRoles: (roles: string[]) => any;
};

export default async function userPreferencesRoutes(fastify: FastifyInstance) {
  const server = fastify as FastifyInstanceWithAuth;

  fastify.addSchema(userPreferencesSchema);
  fastify.addSchema(userPreferencesResponseSchema);
  fastify.addSchema(errorResponseSchema);

  // Get current user's preferences
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: { $ref: 'userPreferencesResponse#' },
        404: { $ref: 'userPreferencesErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.getCurrentUserPreferencesHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Get current user preferences');
      done();
    },
  });

  // Create preferences for current user
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createUserPreferencesBodySchema,
      response: {
        201: { $ref: 'userPreferencesResponse#' },
        400: { $ref: 'userPreferencesErrorResponse#' },
        409: { $ref: 'userPreferencesErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.createUserPreferencesHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Create user preferences');
      done();
    },
  });

  // Update current user's preferences
  fastify.route({
    method: 'PUT',
    url: '/',
    schema: {
      body: updateUserPreferencesBodySchema,
      response: {
        200: { $ref: 'userPreferencesResponse#' },
        400: { $ref: 'userPreferencesErrorResponse#' },
        404: { $ref: 'userPreferencesErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.updateCurrentUserPreferencesHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Update user preferences');
      done();
    },
  });

  // Delete current user's preferences
  fastify.route({
    method: 'DELETE',
    url: '/',
    schema: {
      response: {
        204: {
          type: 'null',
          description: 'No content',
        },
        404: { $ref: 'userPreferencesErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.deleteCurrentUserPreferencesHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Delete user preferences');
      done();
    },
  });
}
