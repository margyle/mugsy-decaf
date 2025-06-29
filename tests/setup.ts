import { beforeAll, afterAll } from 'vitest';
import betterSqlite3 from 'better-sqlite3';
import { join } from 'path';
import dotenv from 'dotenv';

// Globals for tests
declare global {
  var app: any;
  var dbClient: any;
  var sqliteDb: any;
}

// Load test environment variables
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  console.log('🔧 Setting up SQLite DB and Fastify app...');

  // Clear module cache so imports pick up test env
  ['../src/db', '../src/auth-config', '../src/app'].forEach(p => {
    try {
      delete require.cache[require.resolve(p)];
    } catch {}
  });

  const dbUrl = process.env.DATABASE_URL!;
  const sqlite = betterSqlite3(dbUrl, { fileMustExist: false });
  global.sqliteDb = sqlite;

  const { drizzle } = await import('drizzle-orm/better-sqlite3');
  const db = drizzle(sqlite);
  global.dbClient = db;

  console.log('➡️ Running migrations...');
  const { migrate } = await import('drizzle-orm/better-sqlite3/migrator');
  await migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });

  console.log('➡️ Building Fastify app...');
  const { buildApp } = await import('../src/app');
  global.app = buildApp({ dbClient: db });
  await global.app.ready();
});

afterAll(async () => {
  if (global.app) {
    await global.app.close();
  }

  if (global.sqliteDb) {
    global.sqliteDb.close();
  }
});
