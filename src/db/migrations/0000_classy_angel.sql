DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
CREATE TYPE "public"."providers" AS ENUM('google', 'local', 'phone');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('ngo', 'volunteer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verificationType" AS ENUM('mobile_number_verification', 'email_verification', 'password_reset');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar,
	"phone" varchar,
	"first_name" varchar(256),
	"last_name" varchar(256),
	"role" "roles" DEFAULT 'volunteer' NOT NULL,
	"provider" "providers" DEFAULT 'local' NOT NULL,
	"password_hash" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_email_verified" boolean DEFAULT false,
	"email_verified_at" timestamp,
	"is_phone_verified" boolean DEFAULT false,
	"phone_verified_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "email_required_if_not_phone" CHECK (provider = 'phone' OR email IS NOT NULL),
	CONSTRAINT "name_required_if_not_phone" CHECK (provider = 'phone' OR (first_name IS NOT NULL AND last_name IS NOT NULL)),
	CONSTRAINT "password_provider_check" CHECK ((provider IN ('google', 'phone') AND password_hash IS NULL) OR (provider = 'local' AND password_hash IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"verification_type" "verificationType" NOT NULL,
	"token" varchar(256) NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "expires_in_future" CHECK (expires_at > CURRENT_TIMESTAMP)
);
--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "fk_verifications_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "verification_userId_idx" ON "verifications" USING btree ("user_id");