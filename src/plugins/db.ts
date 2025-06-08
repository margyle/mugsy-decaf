import fp from 'fastify-plugin';
import betterSqlite3 from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { dbConfig } from '../config';
import * as schema from '../db/schema';

// tell Fastify about our decorator
declare module 'fastify' {
  interface FastifyInstance {
    /** Drizzle ORM client instance */
    db: ReturnType<typeof drizzle<typeof schema>>;
  }
}

export interface DbPluginOptions {
  /** if provided, use this client instead of opening a new one */
  client?: ReturnType<typeof drizzle<typeof schema>>;
}

export default fp(async (fastify, opts: DbPluginOptions) => {
  // Use provided client (for tests) or create a new SQLite file-based client at dbConfig.url
  const client =
    opts.client ?? drizzle(betterSqlite3(dbConfig.url), { schema });
  fastify.decorate('db', client);
});
