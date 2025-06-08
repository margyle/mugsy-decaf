import { FastifyInstance } from 'fastify';
import * as handlers from './handlers';
import {
  tagSchema,
  tagResponseSchema,
  tagsArrayResponseSchema,
  errorResponseSchema,
  createTagBodySchema,
  addTagsToRecipeBodySchema,
} from './schema';

// Using a type that includes the custom plugins
// type FastifyInstanceWithAuth = FastifyInstance & {
//   authenticate: any;
//   authorizeRoles: (roles: string[]) => any;
// };

export default async function tagRoutes(fastify: FastifyInstance) {
  // const server = fastify as FastifyInstanceWithAuth;

  // Register all schemas
  fastify.addSchema(tagSchema);
  fastify.addSchema(tagResponseSchema);
  fastify.addSchema(tagsArrayResponseSchema);
  fastify.addSchema(errorResponseSchema);

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createTagBodySchema,
      response: {
        201: { $ref: 'tagResponse#' },
        400: { $ref: 'errorResponse#' },
        409: { $ref: 'errorResponse#' },
      },
    },
    // preHandler: [server.authenticate],
    handler: handlers.createTagHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Create tag');
      done();
    },
  });

  fastify.route({
    method: 'POST',
    url: '/add-to-recipe',
    schema: {
      body: addTagsToRecipeBodySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            recipe_id: { type: 'string' },
            tags_added: {
              type: 'array',
              items: { $ref: 'tagResponse#' },
            },
          },
        },
        400: { $ref: 'errorResponse#' },
        500: { $ref: 'errorResponse#' },
      },
    },
    handler: handlers.addTagsToRecipeHandler,
    onResponse: (request, reply, done) => {
      fastify.logOperation(request, reply, 'Add tags to recipe');
      done();
    },
  });
}
