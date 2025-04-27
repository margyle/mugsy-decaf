import { FastifyInstance } from 'fastify';
import * as handlers from './handlers';
import {
  catSchema,
  getCatParamsSchema,
  createCatBodySchema,
  updateCatBodySchema,
} from './schema';

// Using a type that includes the custom plugins
type FastifyInstanceWithAuth = FastifyInstance & {
  authenticate: any;
  authorizeRoles: (roles: string[]) => any;
};

export default async function catRoutes(fastify: FastifyInstance) {
  // Cast fastify to include our custom authenticate decorator
  const server = fastify as FastifyInstanceWithAuth;

  // Register the cat schema
  fastify.addSchema(catSchema);

  // get all cats
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: {
          type: 'array',
          items: { $ref: 'cat#' },
        },
      },
    },
    handler: handlers.getAllCatsHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Get all cats');
      done();
    },
  });

  // get cat by id
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: getCatParamsSchema,
      response: {
        200: { $ref: 'cat#' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    handler: handlers.getCatByIdHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Get cat by ID');
      done();
    },
  });

  // create cat
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createCatBodySchema,
      response: {
        201: { $ref: 'cat#' },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.createCatHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Create cat');
      done();
    },
  });

  // update cat
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: getCatParamsSchema,
      body: updateCatBodySchema,
      response: {
        200: { $ref: 'cat#' },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.updateCatHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Update cat');
      done();
    },
  });

  // delete cat
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: getCatParamsSchema,
      response: {
        204: {
          type: 'null',
          description: 'No content',
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.deleteCatHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Delete cat');
      done();
    },
  });
}
