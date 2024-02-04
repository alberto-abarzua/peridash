CREATE SCHEMA "peridash";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "peridash"."symbol" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar(64),
	"exchange" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "peridash"."ticker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_favorite" boolean DEFAULT false,
	"symbol_id" uuid,
	"buy" double precision,
	"gain" double precision,
	"loss" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "peridash"."ticker_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"plot_range" integer,
	"stats_range" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "peridash"."ticker_settings_to_ticker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticker_id" uuid,
	"ticker_settings_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "peridash"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_user_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "peridash"."ticker_settings" ADD CONSTRAINT "ticker_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "peridash"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "peridash"."ticker_settings_to_ticker" ADD CONSTRAINT "ticker_settings_to_ticker_ticker_id_ticker_id_fk" FOREIGN KEY ("ticker_id") REFERENCES "peridash"."ticker"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "peridash"."ticker_settings_to_ticker" ADD CONSTRAINT "ticker_settings_to_ticker_ticker_settings_id_ticker_settings_id_fk" FOREIGN KEY ("ticker_settings_id") REFERENCES "peridash"."ticker_settings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
