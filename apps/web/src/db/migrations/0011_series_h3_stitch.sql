ALTER TABLE `episodes` ADD `prompt` text(2048) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `episodes` ADD `first_frame_url` text(1024);--> statement-breakpoint
ALTER TABLE `episodes` ADD `last_frame_url` text(1024);--> statement-breakpoint
ALTER TABLE `episodes` ADD `h3_model` text(120) DEFAULT 'wavespeed-ai/minimax-h3/image-to-video-lora' NOT NULL;--> statement-breakpoint
ALTER TABLE `episodes` ADD `resolution` text(20) DEFAULT '768p' NOT NULL;--> statement-breakpoint
-- Update existing episodes duration from 60 to 5 where needed (keep 60 if already used, but default now 5)
-- New episodes will default to 5s; existing seed rows remain until regenerated via generate-series-local
