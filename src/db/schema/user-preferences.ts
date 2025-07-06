import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from './auth';

export const strengthPreferenceEnum = ['light', 'medium', 'strong'] as const;

export const userPreferences = sqliteTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  strengthPreference: text('strength_preference', {
    enum: strengthPreferenceEnum,
  })
    .notNull()
    .default('medium'),
  defaultCupSize: integer('default_cup_size').notNull().default(300), // ml
  notificationsBrewed: integer('notifications_brewed', { mode: 'boolean' })
    .notNull()
    .default(true),
  notificationsMaintenance: integer('notifications_maintenance', {
    mode: 'boolean',
  })
    .notNull()
    .default(true),
  notificationsErrors: integer('notifications_errors', { mode: 'boolean' })
    .notNull()
    .default(true),
  notificationMethod: text('notification_method').notNull().default('email'), // email, sms, push, none
  smsPhoneNumber: text('sms_phone_number'),
  allowIntegrations: integer('allow_integrations', { mode: 'boolean' })
    .notNull()
    .default(false),
  cloudControlAccess: integer('cloud_control_access', { mode: 'boolean' })
    .notNull()
    .default(false),
  theme: text('theme').notNull().default('auto'), // light, dark, custom-name, auto
  autoBrewSchedule: text('auto_brew_schedule'), // JSON string for schedule
  units: text('units').notNull().default('metric'), // metric, imperial
  shareRecipes: integer('share_recipes', { mode: 'boolean' })
    .notNull()
    .default(true),
  language: text('language').notNull().default('en'), // en, es, fr, etc.
  timezone: text('timezone').notNull().default('UTC'), // IANA timezone names (e.g., 'America/New_York', 'Europe/London')
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type StrengthPreference = (typeof strengthPreferenceEnum)[number];
