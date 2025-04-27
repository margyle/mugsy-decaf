-- Create a new table with the correct foreign key reference
CREATE TABLE IF NOT EXISTS temp_recipe_steps (
  id text PRIMARY KEY NOT NULL,
  recipe_id text NOT NULL,
  step_order integer NOT NULL,
  duration_sec integer,
  command text,
  command_type text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON UPDATE no action ON DELETE no action
);

-- Copy data from the old table (if any exists)
INSERT OR IGNORE INTO temp_recipe_steps
SELECT id, recipe_id, step_order, duration_sec, command, command_type, created_at, updated_at 
FROM recipe_steps;

-- Drop the old table
DROP TABLE recipe_steps;

-- Rename the temporary table to the original name
ALTER TABLE temp_recipe_steps RENAME TO recipe_steps; 