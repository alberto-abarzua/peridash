ALTER TABLE "peridash"."ticker" ALTER COLUMN "last_notification_info" SET DEFAULT '{"last_sent":"1970-01-01T00:00:00.000Z","reason":"","previous_price":0}'::json;