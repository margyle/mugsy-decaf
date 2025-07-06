import { FastifyInstance } from 'fastify';
import userPreferencesRoutes from './routes';

export default async function userPreferencesFeature(fastify: FastifyInstance) {
  fastify.register(userPreferencesRoutes, { prefix: '/user-preferences' });
}
