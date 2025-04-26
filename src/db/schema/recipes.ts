// src/db/schema.ts
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey(), // UUID stored as TEXT
  created_by: text("created_by"),
  name: text("name").notNull(),
  description: text("description"),
  coffee_weight: real("coffee_weight").notNull(),
  water_weight: real("water_weight").notNull(),
  water_temperature: integer("water_temperature").notNull(),
  grind_size: text("grind_size"),
  brew_time: integer("brew_time").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const recipe_steps = sqliteTable("recipe_steps", {
  id: text("id").primaryKey(),
  recipe_id: text("recipe_id")
    .notNull()
    .references(() => recipes.id),
  step_order: integer("step_order").notNull(),
  duration_sec: integer("duration_sec"),
  command: text("payload"), // JSON command to be sent to operator
  command_type: text("command_type"), // TODO: figure out how to store type: moves, grind, pour, etc

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const recipeStepIndex = index("idx_recipe_steps_recipe_id").on(
  recipe_steps.recipe_id
);
