import { FastifyInstance } from "fastify";
import catsFeature from "./cats";
import authFeature from "./auth";

export default async function features(fastify: FastifyInstance) {
  // Register all features directly without version prefix
  // Register individual features
  fastify.register(catsFeature);
  fastify.register(authFeature);

  // Add more features here as needed
  // fastify.register(ordersFeature);
}
