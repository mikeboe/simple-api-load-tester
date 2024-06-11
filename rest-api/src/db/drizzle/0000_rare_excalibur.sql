CREATE TABLE IF NOT EXISTS "api_logs" (
	"test_id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now(),
	"method" text,
	"url" text,
	"response_time_ms" double precision,
	"status_code" integer,
	"response_message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tests" (
	"id" text PRIMARY KEY NOT NULL,
	"test_name" text,
	"base_url" text,
	"duration" integer,
	"rps" integer,
	"use_statistical_distribution" boolean,
	"headers" text,
	"text" text,
	"created_at" timestamp with time zone DEFAULT now()
);
