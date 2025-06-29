process.env.NODE_ENV = 'test';
// process.env.DATABASE_URL = 'file:shared?mode=memory&cache=shared';
process.env.DATABASE_URL = 'testdb';

import { beforeAll, afterAll } from 'vitest';
import betterSqlite3 from 'better-sqlite3';
import { join } from 'path';

// Globals for tests
declare global {
  var app: any;
  var dbClient: any;
  var sqliteDb: any;
}

beforeAll(async () => {
  console.log('🔧 Setting up in-memory DB and Fastify app...');

  // Clear module cache so imports pick up test env
  ['../src/db', '../src/auth-config', '../src/app'].forEach(p => {
    try {
      delete require.cache[require.resolve(p)];
    } catch {}
  });

  // 1) Initialize in-memory SQLite
  // Use the shared in-memory URI from env
  const dbUrl = process.env.DATABASE_URL!;
  const sqlite = betterSqlite3(dbUrl, { fileMustExist: false });
  global.sqliteDb = sqlite;

  // 2) Initialize Drizzle ORM
  const { drizzle } = await import('drizzle-orm/better-sqlite3');
  const db = drizzle(sqlite);
  global.dbClient = db;

  // 3) Run migrations (core + auth)
  console.log('➡️ Running migrations...');
  const { migrate } = await import('drizzle-orm/better-sqlite3/migrator');
  await migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });

  // 4) Build and start Fastify app with injected DB
  console.log('➡️ Building Fastify app...');
  const { buildApp } = await import('../src/app');
  global.app = buildApp({ dbClient: db });
  await global.app.ready();
});

afterAll(async () => {
  console.log('🧹 Tearing down Fastify app and DB...');
  // try {
  //   global.sqliteDb.prepare('DELETE FROM "user"').run();
  //   console.log('✔️ Cleared user table');
  // } catch (err) {
  //   console.warn('⚠️ Could not clear user table before signup:', err);
  // }
  if (global.app) await global.app.close();
});
