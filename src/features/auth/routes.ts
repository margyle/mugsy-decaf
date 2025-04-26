import { FastifyInstance } from "fastify";
import * as handlers from "./handlers";
import { loginSchema, registerSchema } from "./schema";

export default async function authRoutes(fastify: FastifyInstance) {
  // Register schemas
  fastify.addSchema(loginSchema);
  fastify.addSchema(registerSchema);

  // Login route
  fastify.route({
    method: "POST",
    url: "/login",
    schema: {
      body: { $ref: "login#" },
      response: {
        200: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                username: { type: "string" },
                role: { type: "string" },
              },
            },
            token: { type: "string" },
          },
        },
        401: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: handlers.loginHandler,
  });

  // Register route
  fastify.route({
    method: "POST",
    url: "/register",
    schema: {
      body: { $ref: "register#" },
      response: {
        201: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                username: { type: "string" },
                role: { type: "string" },
              },
            },
            token: { type: "string" },
          },
        },
        409: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: handlers.registerHandler,
  });
}
