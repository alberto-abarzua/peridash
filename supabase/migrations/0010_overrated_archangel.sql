ALTER TABLE "peridash"."ticker_settings" ALTER COLUMN "plot_range" SET DEFAULT 7;--> statement-breakpoint
ALTER TABLE "peridash"."ticker_settings" ADD COLUMN "carousel_time" integer DEFAULT 8;