ALTER TABLE `users` RENAME COLUMN `username` TO `name`;--> statement-breakpoint
DROP INDEX IF EXISTS `users_username_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `users_email_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `email`;