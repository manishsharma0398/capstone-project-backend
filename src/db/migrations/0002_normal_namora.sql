ALTER TABLE "applications" RENAME COLUMN "status" TO "applicaion_status";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "message" SET DEFAULT '';