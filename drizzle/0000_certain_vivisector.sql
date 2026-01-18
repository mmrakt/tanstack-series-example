CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenant_id` text NOT NULL,
	`clerk_user_id` text,
	`name` text NOT NULL,
	`role` text DEFAULT 'employee' NOT NULL,
	`joined_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `employees_tenant_idx` ON `employees` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `employees_clerk_user_idx` ON `employees` (`clerk_user_id`);--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenant_id` text NOT NULL,
	`item_name` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `inventory_tenant_idx` ON `inventory` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`budget` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `projects_tenant_idx` ON `projects` (`tenant_id`);