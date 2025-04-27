import { FastifyInstance } from 'fastify';
import * as handlers from './handlers';
import {
  recipeSchema,
  recipeStepSchema,
  recipeResponseSchema,
  recipeWithStepsResponseSchema,
  recipeStepResponseSchema,
  recipesArrayResponseSchema,
  recipeStepsArrayResponseSchema,
  errorResponseSchema,
  getRecipeParamsSchema,
  createRecipeBodySchema,
  updateRecipeBodySchema,
  getRecipeStepParamsSchema,
  createRecipeStepBodySchema,
  updateRecipeStepBodySchema,
} from './schema';

type FastifyInstanceWithAuth = FastifyInstance & {
  authenticate: any;
  authorizeRoles: (roles: string[]) => any;
};

export default async function recipeRoutes(fastify: FastifyInstance) {
  // Cast fastify to include our custom authenticate decorator
  const server = fastify as FastifyInstanceWithAuth;

  // Register all schemas
  fastify.addSchema(recipeSchema);
  fastify.addSchema(recipeStepSchema);
  fastify.addSchema(recipeResponseSchema);
  fastify.addSchema(recipeWithStepsResponseSchema);
  fastify.addSchema(recipeStepResponseSchema);
  fastify.addSchema(recipesArrayResponseSchema);
  fastify.addSchema(recipeStepsArrayResponseSchema);
  fastify.addSchema(errorResponseSchema);

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
      params: getRecipeParamsSchema,
      response: {
        200: { $ref: 'recipeWithStepsResponse#' },
        404: { $ref: 'recipeErrorResponse#' },
      },
    },
    handler: handlers.getRecipeByIdHandler,
  });

  // Create recipe
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createRecipeBodySchema,
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
      params: getRecipeParamsSchema,
      body: updateRecipeBodySchema,
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
      params: getRecipeParamsSchema,
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
      params: getRecipeParamsSchema,
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
      params: getRecipeStepParamsSchema,
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
      body: createRecipeStepBodySchema,
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
      params: getRecipeStepParamsSchema,
      body: updateRecipeStepBodySchema,
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
      params: getRecipeStepParamsSchema,
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
