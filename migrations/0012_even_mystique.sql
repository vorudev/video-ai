DROP TABLE "tier_limits" CASCADE;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "video_generations_per_month" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "max_video_duration_seconds" integer NOT NULL;