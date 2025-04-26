// src/db/schema.ts
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ————————————————
// Recipes
// ————————————————
export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey(), // UUID stored as TEXT
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

// ————————————————
// Recipe Steps
// ————————————————
export const recipe_steps = sqliteTable("recipe_steps", {
  id: text("id").primaryKey(),
  recipe_id: text("recipe_id")
    .notNull()
    .references(() => recipes.id),
  step_order: integer("step_order").notNull(),
  instruction: text("instruction").notNull(),
  duration_sec: integer("duration_sec"),
  payload: text("payload"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Create index separately
export const recipeStepIndex = index("idx_recipe_steps_recipe_id").on(
  recipe_steps.recipe_id
);
