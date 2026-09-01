CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text(80) NOT NULL,
	`prompt` text NOT NULL,
	`r2_key` text(1024) NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `videos_category_idx` ON `videos` (`category`);--> statement-breakpoint
CREATE INDEX `videos_status_idx` ON `videos` (`status`);--> statement-breakpoint
CREATE INDEX `videos_created_idx` ON `videos` (`created_at`);--> statement-breakpoint
CREATE TABLE `streams` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text(80) NOT NULL,
	`is_live` integer DEFAULT false NOT NULL,
	`current_video_id` text,
	FOREIGN KEY (`current_video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `streams_category_idx` ON `streams` (`category`);--> statement-breakpoint
CREATE INDEX `streams_current_video_idx` ON `streams` (`current_video_id`);