CREATE TABLE `recipe_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_id` text NOT NULL,
	`step_order` integer NOT NULL,
	`instruction` text NOT NULL,
	`duration_sec` integer,
	`payload` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_by` text,
	`name` text NOT NULL,
	`description` text,
	`coffee_weight` real NOT NULL,
	`water_weight` real NOT NULL,
	`water_temperature` integer NOT NULL,
	`grind_size` text,
	`brew_time` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
