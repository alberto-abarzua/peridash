ALTER TABLE "peridash"."symbol" ADD COLUMN "eod_data" json;--> statement-breakpoint
ALTER TABLE "peridash"."symbol" ADD COLUMN "eod_updated_at" timestamp DEFAULT now();