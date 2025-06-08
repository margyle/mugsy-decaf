import { FastifyInstance } from 'fastify';
import * as handlers from './handlers';
import * as schema from './schema';

type FastifyInstanceWithAuth = FastifyInstance & {
  authenticate: any;
  authorizeRoles: (roles: string[]) => any;
};

export default async function recipeRoutes(fastify: FastifyInstance) {
  // Cast fastify to include our custom authenticate decorator
  const server = fastify as FastifyInstanceWithAuth;

  // Register all schemas
  fastify.addSchema(schema.recipeSchema);
  fastify.addSchema(schema.recipeStepSchema);
  fastify.addSchema(schema.recipeResponseSchema);
  fastify.addSchema(schema.recipeWithStepsResponseSchema);
  fastify.addSchema(schema.recipeStepResponseSchema);
  fastify.addSchema(schema.recipesArrayResponseSchema);
  fastify.addSchema(schema.recipeStepsArrayResponseSchema);
  fastify.addSchema(schema.errorResponseSchema);

  // Get all recipes
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: { $ref: 'recipesArrayResponse#' },
      },
    },
    handler: handlers.getAllRecipesHandler,
  });

  // Get recipe by ID (with steps)
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: schema.getRecipeParamsSchema,
      response: {
        200: { $ref: 'recipeWithStepsResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    handler: handlers.getRecipeByIdHandler,
  });

  // Get recipes by user ID
  fastify.route({
    method: 'GET',
    url: '/user/:id',
    schema: {
      params: schema.getRecipeByUserIdParamsSchema,
      response: {
        200: { $ref: 'recipesArrayResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.getRecipesByUserIdHandler,
  });

  // Create recipe
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: schema.createRecipeBodySchema,
      response: {
        201: { $ref: 'recipeResponse#' },
        400: { $ref: 'recipeErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.createRecipeHandler,
  });

  // Update recipe
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: schema.getRecipeParamsSchema,
      body: schema.updateRecipeBodySchema,
      response: {
        200: { $ref: 'recipeResponse#' },
        400: { $ref: 'recipeErrorResponse#' },
        403: { $ref: 'recipeErrorResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.updateRecipeHandler,
  });

  // Delete recipe
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: schema.getRecipeParamsSchema,
      response: {
        204: {
          type: 'null',
          description: 'No content',
        },
        403: { $ref: 'recipeErrorResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.deleteRecipeHandler,
  });

  // Recipe Steps Routes ---------------------------------

  // Get all steps for a recipe
  fastify.route({
    method: 'GET',
    url: '/:id/steps',
    schema: {
      params: schema.getRecipeParamsSchema,
      response: {
        200: { $ref: 'recipeStepsArrayResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    handler: handlers.getRecipeStepsHandler,
  });

  // Get step by ID
  fastify.route({
    method: 'GET',
    url: '/steps/:id',
    schema: {
      params: schema.getRecipeStepParamsSchema,
      response: {
        200: { $ref: 'recipeStepResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    handler: handlers.getRecipeStepByIdHandler,
  });

  // Create step
  fastify.route({
    method: 'POST',
    url: '/steps',
    schema: {
      body: schema.createRecipeStepBodySchema,
      response: {
        201: { $ref: 'recipeStepResponse#' },
        400: { $ref: 'recipeErrorResponse#' },
        403: { $ref: 'recipeErrorResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.createRecipeStepHandler,
  });

  // Update step
  fastify.route({
    method: 'PUT',
    url: '/steps/:id',
    schema: {
      params: schema.getRecipeStepParamsSchema,
      body: schema.updateRecipeStepBodySchema,
      response: {
        200: { $ref: 'recipeStepResponse#' },
        400: { $ref: 'recipeErrorResponse#' },
        403: { $ref: 'recipeErrorResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.updateRecipeStepHandler,
  });

  // Delete step
  fastify.route({
    method: 'DELETE',
    url: '/steps/:id',
    schema: {
      params: schema.getRecipeStepParamsSchema,
      response: {
        204: {
          type: 'null',
          description: 'No content',
        },
        403: { $ref: 'recipeErrorResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    preHandler: [server.authenticate],
    handler: handlers.deleteRecipeStepHandler,
  });
}
