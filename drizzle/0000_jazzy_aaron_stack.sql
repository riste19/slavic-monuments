CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`cemetery` text,
	`town` text,
	`memorial_name` text,
	`service` text NOT NULL,
	`style` text NOT NULL,
	`notes` text,
	`language` text DEFAULT 'en' NOT NULL,
	`client_hash` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiries_rate_limit` ON `inquiries` (`client_hash`,`created_at`);--> statement-breakpoint
CREATE TABLE `inquiry_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_id` text NOT NULL,
	`object_key` text NOT NULL,
	`filename` text NOT NULL,
	`mime` text NOT NULL,
	`bytes` integer NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE no action
);
