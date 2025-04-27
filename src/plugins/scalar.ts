import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { envConfig } from '../config';

const scalarPlugin: FastifyPluginAsync = async fastify => {
  // Only enable Scalar API Reference in development or staging
  if (envConfig.NODE_ENV !== 'production') {
    // Use dynamic import for ESM compatibility
    const apiReference = await import('@scalar/fastify-api-reference');

    await fastify.register(apiReference.default, {
      routePrefix: '/reference',
      // Use the default Swagger endpoint
      openApiDocumentEndpoints: {
        json: '/documentation/json',
        yaml: '/documentation/yaml',
      },
      // Additional configuration options
      configuration: {
        title: 'DECAF API',
        theme: 'default', // Other options: alternate, moon, purple, solarized
        // Using Fastify theme with dark mode
        // _integration: 'fastify',
        darkMode: true,
      },
    });
  }
};

export default fp(scalarPlugin);
