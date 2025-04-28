// This file contains setup code that will be executed before all tests
// You can add global test setup, mocks, or utility functions here

import { beforeAll, afterAll } from 'vitest';
import betterSqlite3 from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { join } from 'path';
import { buildApp } from '../src/app';

declare global {
  var app: ReturnType<typeof buildApp>;
  var dbClient: ReturnType<typeof drizzle>;
  var sqliteDb: ReturnType<typeof betterSqlite3>;
}

// Global before/after hooks
beforeAll(async () => {
  console.log('Setting up in-memory DB and Fastify app...');
  // 1) create an in-memory SQLite client
  const sqliteDbHandle = betterSqlite3(':memory:');
  // 2) instantiate Drizzle ORM
  global.sqliteDb = sqliteDbHandle;
  global.dbClient = drizzle(sqliteDbHandle);
  // 3) apply all SQL migrations from the drizzle folder
  migrate(global.dbClient, {
    migrationsFolder: join(process.cwd(), 'drizzle'),
  });
  // 3) build and start Fastify app with test DB
  global.app = buildApp({ dbClient: global.dbClient });
  await global.app.ready();
});

afterAll(async () => {
  console.log('Tearing down Fastify app...');
  if (global.app) {
    await global.app.close();
  }
  if (global.sqliteDb) {
    global.sqliteDb.close();
  }
});

// Optionally mock global dependencies here
// global.fetch = vi.fn();

// You can also define test utilities that will be available to all tests
export function createTestData() {
  return {
    // Sample test data
    sampleCat: {
      id: '1',
      name: 'Test Cat',
      color: 'orange',
      age: 3,
    },
  };
}
