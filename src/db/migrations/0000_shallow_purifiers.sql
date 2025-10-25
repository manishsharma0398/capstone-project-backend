CREATE TYPE "public"."providers_enum" AS ENUM('google', 'local', 'phone');--> statement-breakpoint
CREATE TYPE "public"."user_roles_enum" AS ENUM('organization', 'volunteer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verifications_type_enum" AS ENUM('mobile_number_verification', 'email_verification', 'password_reset');--> statement-breakpoint
CREATE TYPE "public"."listings_status_enum" AS ENUM('active', 'inactive', 'closed', 'draft');--> statement-breakpoint
CREATE TYPE "public"."listings_type_enum" AS ENUM('volunteer_opportunity', 'donation_request', 'event', 'job');--> statement-breakpoint
CREATE TYPE "public"."applications_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"phone" varchar(10),
	"first_name" varchar(256),
	"last_name" varchar(256),
	"role" "user_roles_enum" DEFAULT 'volunteer' NOT NULL,
	"provider" "providers_enum" DEFAULT 'local' NOT NULL,
	"password_hash" text,
	"is_email_verified" boolean DEFAULT false,
	"email_verified_at" timestamp,
	"is_phone_verified" boolean DEFAULT false,
	"phone_verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
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
	"verification_type" "verifications_type_enum" NOT NULL,
	"token" varchar(256) NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verifications_token_unique" UNIQUE("token"),
	CONSTRAINT "expires_in_future" CHECK (expires_at > CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"status" "listings_status_enum" DEFAULT 'draft' NOT NULL,
	"listing_type" "listings_type_enum" NOT NULL,
	"organization_id" integer NOT NULL,
	"location" varchar(255),
	"extra_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" integer NOT NULL,
	"volunteer_id" integer NOT NULL,
	"message" varchar(256),
	"application_status" "applications_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "fk_verifications_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "fk_listings_organization_id" FOREIGN KEY ("organization_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "fk_applications_listing_id" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "fk_applications_volunteer_id" FOREIGN KEY ("volunteer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "verification_userId_idx" ON "verifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_listings_organization_id" ON "listings" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_listings_status" ON "listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_listings_type" ON "listings" USING btree ("listing_type");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_application_per_volunteer" ON "applications" USING btree ("listing_id","volunteer_id");--> statement-breakpoint
CREATE INDEX "idx_applications_listing_id" ON "applications" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "idx_applications_volunteer_id" ON "applications" USING btree ("volunteer_id");