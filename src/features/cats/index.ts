import { FastifyInstance } from "fastify";
import catRoutes from "./routes";

export default async function catsFeature(fastify: FastifyInstance) {
  fastify.register(catRoutes, { prefix: "/cats" });
}
