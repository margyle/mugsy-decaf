import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { recipes } from './recipes';

// Tags table
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(), // Using text to match other tables pattern
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(), // URL-friendly version
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Junction table for many-to-many relationship between recipes and tags
export const recipe_tags = sqliteTable(
  'recipe_tags',
  {
    recipe_id: text('recipe_id')
      .notNull()
      .references(() => recipes.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    tag_id: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  table => ({
    // Composite primary key
    pk: primaryKey({ columns: [table.recipe_id, table.tag_id] }),
    // Indexes for performance
    recipeIdx: index('idx_recipe_tags_recipe_id').on(table.recipe_id),
    tagIdx: index('idx_recipe_tags_tag_id').on(table.tag_id),
  }),
);

// Relations for Drizzle ORM
export const tagsRelations = relations(tags, ({ many }) => ({
  recipe_tags: many(recipe_tags),
}));

export const recipeTagsRelations = relations(recipe_tags, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipe_tags.recipe_id],
    references: [recipes.id],
  }),
  tag: one(tags, {
    fields: [recipe_tags.tag_id],
    references: [tags.id],
  }),
}));
