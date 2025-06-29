import { FastifyInstance } from 'fastify';
import catsFeature from './cats';
import recipesFeature from './recipes';

export default async function features(fastify: FastifyInstance) {
  fastify.register(catsFeature);
  fastify.register(recipesFeature);
}
