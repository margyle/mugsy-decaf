import { FastifyInstance } from 'fastify';
import tagRoutes from './routes';

export default async function tagsFeature(fastify: FastifyInstance) {
  fastify.register(tagRoutes, { prefix: '/tags' });
}
