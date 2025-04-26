import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import authPlugin from "./auth";
import corsPlugin from "./cors";
import helmetPlugin from "./helmet";
import swaggerPlugin from "./swagger";
import errorHandler from "./errorHandler";
import validationPlugin from "./validation";
import loggerPlugin from "./logger";

const plugins: FastifyPluginAsync = async (fastify) => {
  // Register plugins in appropriate order
  await fastify.register(loggerPlugin); // Register logger first for debug visibility
  await fastify.register(corsPlugin);
  await fastify.register(helmetPlugin);
  await fastify.register(errorHandler);
  await fastify.register(validationPlugin); // Register validation before auth
  await fastify.register(authPlugin);
  await fastify.register(swaggerPlugin);
};

export default fp(plugins);
