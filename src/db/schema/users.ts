import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// This tells SQLite "CREATE UNIQUE INDEX idx_users_username ON users(username)"
export const idxUsersUsername = uniqueIndex('idx_users_username').on(
  users.username,
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
