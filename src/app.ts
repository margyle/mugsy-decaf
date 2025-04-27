import Fastify from 'fastify';
import { appConfig } from './config';
import plugins from './plugins';
import features from './features';
import { logger } from './utils/logger';

export function buildApp() {
  // Create Fastify instance with configuration and logger
  const fastify = Fastify({
    ...appConfig.fastify,
    logger,
  });

  // Register plugins
  fastify.register(plugins);

  // Register API features with prefix including version
  fastify.register(features, {
    prefix: `${appConfig.apiPrefix}/${appConfig.apiVersion}`,
  });

  // Define root route
  fastify.get('/', async () => {
    return {
      name: 'DECAF API',
      description: 'Does Every Coffee Action, Friend',
      version: '1.0.0',
    };
  });

  // Define health check route
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return fastify;
}
