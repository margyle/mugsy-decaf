import Fastify from 'fastify';
import { appConfig } from './config';
import plugins from './plugins';
import features from './features';
import { logger } from './utils/logger';
import dbPlugin, { DbPluginOptions } from './plugins/db';

export function buildApp(options?: { dbClient?: DbPluginOptions['client'] }) {
  // Create Fastify instance with configuration and logger
  const fastify = Fastify({
    ...appConfig.fastify,
    logger,
  });

  // Register the database plugin (or use provided in-memory client)
  fastify.register(dbPlugin, { client: options?.dbClient });
  // Register core plugins
  fastify.register(plugins);

  // Register API features with prefix including version
  fastify.register(features, {
    prefix: `${appConfig.apiPrefix}/${appConfig.apiVersion}`,
  });

  // fastify.ready(() => {
  //   console.log('📋 Registered routes:');
  //   console.log(fastify.printRoutes());
  // });

  // Define root route
  fastify.get('/', async () => {
    return {
      name: 'DECAF API',
      description: 'Does Every Coffee Action, Friend',
      version: '0.1.0',
    };
  });

  // Define health check route
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return fastify;
}
