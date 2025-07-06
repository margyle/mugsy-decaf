import { FastifyInstance } from 'fastify';
import catsFeature from './cats';
import recipesFeature from './recipes';
import userPreferencesFeature from './user-preferences';

export default async function features(fastify: FastifyInstance) {
  fastify.register(catsFeature);
  fastify.register(recipesFeature);
  fastify.register(userPreferencesFeature);
}
