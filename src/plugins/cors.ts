import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { FastifyPluginAsync } from 'fastify';
import { envConfig } from '../config';

const corsPlugin: FastifyPluginAsync = async fastify => {
  // Set CORS options based on environment
  const corsOptions = {
    origin:
      envConfig.NODE_ENV === 'production'
        ? ['https://decaf-app.com', 'https://admin.decaf-app.com'] //TODO: update with actual domains
        : true,
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  await fastify.register(cors, corsOptions);
};

export default fp(corsPlugin);
