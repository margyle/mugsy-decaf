import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

/**
 * Fastify plugin that adds global logging hooks and utilities
 */
export default fp(
  async function (fastify: FastifyInstance) {
    // Add onRequest hook for logging incoming requests
    fastify.addHook("onRequest", (request, reply, done) => {
      request.log.info({
        msg: "Request received",
        method: request.method,
        url: request.url,
      });
      done();
    });

    // Add onResponse hook for logging completed requests
    fastify.addHook("onResponse", (request, reply, done) => {
      request.log.info({
        msg: "Request completed",
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.getResponseTime(),
      });
      done();
    });

    // Add a decorator method for custom operation logging
    fastify.decorate(
      "logOperation",
      function (
        request: FastifyRequest,
        reply: FastifyReply,
        operation: string
      ) {
        request.log.info({
          msg: `${operation} operation completed`,
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
        });
      }
    );

    fastify.log.info("Logger plugin registered");
  },
  {
    name: "logger-plugin",
  }
);

// Type extension for Fastify
declare module "fastify" {
  interface FastifyInstance {
    logOperation(
      request: FastifyRequest,
      reply: FastifyReply,
      operation: string
    ): void;
  }
}
