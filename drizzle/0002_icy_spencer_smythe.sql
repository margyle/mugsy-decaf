CREATE TABLE `user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`strength_preference` text DEFAULT 'medium' NOT NULL,
	`default_cup_size` integer DEFAULT 300 NOT NULL,
	`notifications_brewed` integer DEFAULT true NOT NULL,
	`notifications_maintenance` integer DEFAULT true NOT NULL,
	`notifications_errors` integer DEFAULT true NOT NULL,
	`notification_method` text DEFAULT 'email' NOT NULL,
	`sms_phone_number` text,
	`allow_integrations` integer DEFAULT false NOT NULL,
	`cloud_control_access` integer DEFAULT false NOT NULL,
	`theme` text DEFAULT 'auto' NOT NULL,
	`auto_brew_schedule` text,
	`units` text DEFAULT 'metric' NOT NULL,
	`share_recipes` integer DEFAULT true NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_user_id_unique` ON `user_preferences` (`user_id`);