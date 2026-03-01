CREATE TABLE "tier_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" "subscription_tier" NOT NULL,
	"video_generations_per_month" integer NOT NULL,
	"max_video_duration_seconds" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tier_limits_tier_unique" UNIQUE("tier")
);
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "videos_per_day";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "video_duration";