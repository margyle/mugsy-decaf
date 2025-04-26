import { FastifyInstance } from "fastify";
import authRoutes from "./routes";

export default async function authFeature(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: "/auth" });
}
