CREATE TABLE `episodes` (
	`id` text PRIMARY KEY NOT NULL,
	`series_id` text NOT NULL,
	`num` integer NOT NULL,
	`title` text(255) NOT NULL,
	`duration` integer DEFAULT 60 NOT NULL,
	`poster_url` text(1024) NOT NULL,
	`video_url` text(1024) NOT NULL,
	`locked` integer DEFAULT false NOT NULL,
	`unlock_price` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`update_counter` integer DEFAULT 0,
	FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `episodes_series_idx` ON `episodes` (`series_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `episodes_series_num_unique` ON `episodes` (`series_id`,`num`);--> statement-breakpoint
CREATE INDEX `episodes_locked_idx` ON `episodes` (`locked`);--> statement-breakpoint
CREATE TABLE `series` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`update_counter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`category` text(80) NOT NULL,
	`thumbnail` text(1024) NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`creator` text(120) NOT NULL,
	`tags_json` text DEFAULT '[]' NOT NULL,
	`is_new` integer DEFAULT true NOT NULL,
	`vip_required` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `series_slug_unique` ON `series` (`slug`);--> statement-breakpoint
CREATE INDEX `series_category_idx` ON `series` (`category`);--> statement-breakpoint
CREATE INDEX `series_is_new_idx` ON `series` (`is_new`);--> statement-breakpoint
CREATE INDEX `series_created_idx` ON `series` (`created_at`);--> statement-breakpoint
INSERT INTO `series` (`id`, `created_at`, `updated_at`, `update_counter`, `title`, `slug`, `category`, `thumbnail`, `description`, `creator`, `tags_json`, `is_new`, `vip_required`) VALUES
('ser_private_lessons', 1788230400000, 1788230400000, 0, 'Private Lessons', 'private-lessons', 'series', 'https://cdn.veilwick.com/thumbnails/private-lessons-720x1280.jpg', 'Intimate one-on-one lessons with Mia Malkova — 60s vertical episodes, 720x1280.', 'Mia Malkova', '["nsfw","series","private"]', 1, 0),
('ser_new_stepsister', 1788230400000, 1788230400000, 0, 'Your New Stepsister', 'your-new-stepsister', 'series', 'https://cdn.veilwick.com/thumbnails/your-new-stepsister-720x1280.jpg', 'Forbidden cohabitation fantasy with DarkAngel666 — 60s vertical episodes, 720x1280.', 'DarkAngel666', '["nsfw","series","stepsister"]', 1, 0);
--> statement-breakpoint
INSERT INTO `episodes` (`id`, `series_id`, `num`, `title`, `duration`, `poster_url`, `video_url`, `locked`, `unlock_price`, `created_at`, `updated_at`, `update_counter`) VALUES
('ep_private_lessons_1', 'ser_private_lessons', 1, 'Episode 1 - First Lesson', 60, 'https://cdn.veilwick.com/posters/private-lessons/e1-720x1280.jpg', 'videos/private-lessons/e1.mp4', 0, 0, 1788230400000, 1788230400000, 0),
('ep_private_lessons_2', 'ser_private_lessons', 2, 'Episode 2 - After Class', 60, 'https://cdn.veilwick.com/posters/private-lessons/e2-720x1280.jpg', 'videos/private-lessons/e2.mp4', 0, 0, 1788230400000, 1788230400000, 0),
('ep_private_lessons_3', 'ser_private_lessons', 3, 'Episode 3 - Private Tutoring', 60, 'https://cdn.veilwick.com/posters/private-lessons/e3-720x1280.jpg', 'videos/private-lessons/e3.mp4', 1, 99, 1788230400000, 1788230400000, 0),
('ep_private_lessons_4', 'ser_private_lessons', 4, 'Episode 4 - Study Hall', 60, 'https://cdn.veilwick.com/posters/private-lessons/e4-720x1280.jpg', 'videos/private-lessons/e4.mp4', 1, 99, 1788230400000, 1788230400000, 0),
('ep_private_lessons_5', 'ser_private_lessons', 5, 'Episode 5 - Final Exam', 60, 'https://cdn.veilwick.com/posters/private-lessons/e5-720x1280.jpg', 'videos/private-lessons/e5.mp4', 1, 99, 1788230400000, 1788230400000, 0);
--> statement-breakpoint
INSERT INTO `episodes` (`id`, `series_id`, `num`, `title`, `duration`, `poster_url`, `video_url`, `locked`, `unlock_price`, `created_at`, `updated_at`, `update_counter`) VALUES
('ep_new_stepsister_1', 'ser_new_stepsister', 1, 'Episode 1 - Moving In', 60, 'https://cdn.veilwick.com/posters/your-new-stepsister/e1-720x1280.jpg', 'videos/your-new-stepsister/e1.mp4', 0, 0, 1788230400000, 1788230400000, 0),
('ep_new_stepsister_2', 'ser_new_stepsister', 2, 'Episode 2 - Late Night', 60, 'https://cdn.veilwick.com/posters/your-new-stepsister/e2-720x1280.jpg', 'videos/your-new-stepsister/e2.mp4', 0, 0, 1788230400000, 1788230400000, 0),
('ep_new_stepsister_3', 'ser_new_stepsister', 3, 'Episode 3 - Shared Room', 60, 'https://cdn.veilwick.com/posters/your-new-stepsister/e3-720x1280.jpg', 'videos/your-new-stepsister/e3.mp4', 1, 99, 1788230400000, 1788230400000, 0),
('ep_new_stepsister_4', 'ser_new_stepsister', 4, 'Episode 4 - Family Dinner', 60, 'https://cdn.veilwick.com/posters/your-new-stepsister/e4-720x1280.jpg', 'videos/your-new-stepsister/e4.mp4', 1, 99, 1788230400000, 1788230400000, 0),
('ep_new_stepsister_5', 'ser_new_stepsister', 5, 'Episode 5 - New Rules', 60, 'https://cdn.veilwick.com/posters/your-new-stepsister/e5-720x1280.jpg', 'videos/your-new-stepsister/e5.mp4', 1, 99, 1788230400000, 1788230400000, 0);
