import fp from "fastify-plugin";
import {
  FastifyPluginAsync,
  FastifyError,
  FastifyRequest,
  FastifyReply,
} from "fastify";

// Custom error type with optional status code
interface AppError extends Error {
  statusCode?: number;
  code?: string;
  validation?: any[];
}

const errorHandler: FastifyPluginAsync = async (fastify) => {
  // Add custom error handling
  fastify.setErrorHandler(
    (
      error: FastifyError | AppError,
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      request.log.error(error);

      // Handle validation errors
      if (error.validation) {
        return reply.status(400).send({
          error: "Validation Error",
          message: "The request data is invalid",
          details: error.validation,
        });
      }

      // Handle known status code errors
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          error: error.name,
          message: error.message,
        });
      }

      // Database errors
      if (error.code?.startsWith("DB_")) {
        return reply.status(500).send({
          error: "Database Error",
          message: "An error occurred while accessing the database",
        });
      }

      // Default error handling
      // Don't expose internal errors in production
      const message =
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : error.message;

      return reply.status(500).send({
        error: "Internal Server Error",
        message,
      });
    }
  );

  // Custom 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: "Not Found",
      message: `Route ${request.method}:${request.url} not found`,
    });
  });
};

export default fp(errorHandler);
