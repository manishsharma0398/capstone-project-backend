CREATE TYPE "public"."media_scope_enum" AS ENUM('listing', 'user', 'organization', 'application', 'event', 'message', 'post', 'badge', 'system');--> statement-breakpoint
CREATE TYPE "public"."media_enum" AS ENUM('image', 'video', 'audio', 'document', 'thumbnail', 'banner', 'logo', 'icon', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_experience_level_enum" AS ENUM('beginner', 'medium', 'advanced');--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"entity_id" integer NOT NULL,
	"media_url" varchar(512) NOT NULL,
	"media_type" "media_enum" DEFAULT 'image' NOT NULL,
	"media_scope" "media_scope_enum" DEFAULT 'listing' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"user_experience_level" "user_experience_level_enum" DEFAULT 'beginner' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "fk_media_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_skills" ADD CONSTRAINT "fk_listing_skills_listing_id" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_skills" ADD CONSTRAINT "fk_listing_skills_skill_id" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "fk_user_skills_user_id" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_media_user_id" ON "media" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_media_scope" ON "media" USING btree ("media_scope");--> statement-breakpoint
CREATE INDEX "idx_media_scope_entity" ON "media" USING btree ("media_scope","entity_id");--> statement-breakpoint
CREATE INDEX "idx_media_type" ON "media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "idx_listing_skills_listing_id" ON "listing_skills" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "idx_listing_skills_skill_id" ON "listing_skills" USING btree ("skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_listing_skill" ON "listing_skills" USING btree ("listing_id","skill_id");--> statement-breakpoint
CREATE INDEX "idx_user_skills_organization_id" ON "user_skills" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_skills_status" ON "user_skills" USING btree ("skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_skill" ON "user_skills" USING btree ("user_id","skill_id");