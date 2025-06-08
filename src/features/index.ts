import { FastifyInstance } from 'fastify';
import catsFeature from './cats';
import authFeature from './auth';
import recipesFeature from './recipes';
import tagsFeature from './tags';

export default async function features(fastify: FastifyInstance) {
  fastify.register(catsFeature);
  fastify.register(authFeature);
  fastify.register(recipesFeature);
  fastify.register(tagsFeature);
}
