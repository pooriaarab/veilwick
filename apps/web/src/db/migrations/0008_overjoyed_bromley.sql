CREATE TABLE `user_interactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`video_id` text NOT NULL,
	`category` text(80) NOT NULL,
	`watch_ms` integer DEFAULT 0 NOT NULL,
	`liked` integer DEFAULT false NOT NULL,
	`bookmarked` integer DEFAULT false NOT NULL,
	`shared` integer DEFAULT false NOT NULL,
	`action` text DEFAULT 'view' NOT NULL,
	`scroll_depth` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `user_interactions_user_idx` ON `user_interactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_interactions_video_idx` ON `user_interactions` (`video_id`);--> statement-breakpoint
CREATE INDEX `user_interactions_category_idx` ON `user_interactions` (`category`);--> statement-breakpoint
CREATE INDEX `user_interactions_created_idx` ON `user_interactions` (`created_at`);--> statement-breakpoint
ALTER TABLE `user` ADD `user_profile_json` text DEFAULT '{}' NOT NULL;