import { FastifyInstance } from 'fastify';
import recipeRoutes from './routes';

export default async function recipesFeature(fastify: FastifyInstance) {
  fastify.register(recipeRoutes, { prefix: '/recipes' });
}
