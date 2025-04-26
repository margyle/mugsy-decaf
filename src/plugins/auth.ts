import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { envConfig } from "../config";

// Extend FastifyInstance to include authentication helpers
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: number;
      username: string;
      role: string;
    };
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Register the JWT plugin
  await fastify.register(jwt, {
    secret: envConfig.JWT_SECRET,
    sign: {
      expiresIn: envConfig.JWT_EXPIRES_IN,
    },
  });

  // Add authenticate decorator
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: "Unauthorized access" });
      }
    }
  );

  // Add authorization decorator for role-based access control
  fastify.decorate("authorizeRoles", (roles: string[]) => {
    return async (request: FastifyRequest, reply: any) => {
      try {
        await request.jwtVerify();

        if (!roles.includes(request.user.role)) {
          reply.code(403).send({ error: "Insufficient permissions" });
        }
      } catch (err) {
        reply.code(401).send({ error: "Unauthorized access" });
      }
    };
  });
};

export default fp(authPlugin);
