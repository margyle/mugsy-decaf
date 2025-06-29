import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import authPlugin from './auth';
import fastifyCookie from '@fastify/cookie';
import corsPlugin from './cors';
import helmetPlugin from './helmet';
import swaggerPlugin from './swagger';
import scalarPlugin from './scalar';
import errorHandler from './errorHandler';
import validationPlugin from './validation';
import loggerPlugin from './logger';
import dotenv from 'dotenv';

// todo: update once we have prod env setup
dotenv.config({ path: '.env.dev' });

const plugins: FastifyPluginAsync = async fastify => {
  // Register plugins in appropriate order
  await fastify.register(loggerPlugin); // Register logger first for debug visibility
  await fastify.register(corsPlugin);
  await fastify.register(helmetPlugin);
  await fastify.register(errorHandler);
  await fastify.register(validationPlugin); // Register validation before auth
  await fastify.register(swaggerPlugin);
  await fastify.register(scalarPlugin); // Register Scalar after Swagger
  await fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
    parseOptions: {},
  });
  await fastify.register(authPlugin);
};

export default fp(plugins);
