import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import { FastifyPluginAsync } from 'fastify';

const helmetPlugin: FastifyPluginAsync = async fastify => {
  // Configure security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:'],
      },
    },
  });
};

export default fp(helmetPlugin);
