import { drizzle } from 'drizzle-orm/better-sqlite3';
import DatabaseConstructor, { Database } from 'better-sqlite3';

import { dbConfig } from '../config';
import * as schema from './schema';

// Make sure the data directory exists
import { mkdirSync, existsSync } from 'fs';
import { dirname, resolve, isAbsolute } from 'path';

// Ensure the database directory exists
const dbPath = isAbsolute(dbConfig.url)
  ? dbConfig.url
  : resolve(process.cwd(), dbConfig.url);

// Create directory if needed
const dbDir = dirname(dbPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Create the database connection
const sqliteDb = new DatabaseConstructor(dbPath);

// Initialize Drizzle with schema
export const db = drizzle(sqliteDb, { schema });

// Helper function to get the underlying SQLite instance if needed
export function getSqliteDb(): Database {
  return sqliteDb;
}
