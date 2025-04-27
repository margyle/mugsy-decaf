import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import { FastifyPluginAsync } from 'fastify';

const helmetPlugin: FastifyPluginAsync = async fastify => {
  // Configure security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
  });
};

export default fp(helmetPlugin);
