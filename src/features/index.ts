import { FastifyInstance } from 'fastify';
import catsFeature from './cats';
import authFeature from './auth';

export default async function features(fastify: FastifyInstance) {
  fastify.register(catsFeature);
  fastify.register(authFeature);
}
