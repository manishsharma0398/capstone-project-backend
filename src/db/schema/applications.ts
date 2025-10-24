import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user";
import { listings } from "./listings";

enum FieldNames {
  ID = "id",
  LISTING_ID = "listing_id",
  VOLUNTEER_ID = "volunteer_id",
  MESSAGE = "message",
  APPLICATION_STATUS = "application_status",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export enum ApplicationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export const applicationStatus = Object.values(ApplicationStatus) as [
  string,
  ...string[],
];

export const applicationStatusEnum = pg.pgEnum(
  "applications_status_enum",
  applicationStatus,
);

export const applications = pg.pgTable(
  "applications",
  {
    id: pg.serial(FieldNames.ID).primaryKey().notNull(),
    listingId: pg.integer(FieldNames.LISTING_ID).notNull(),
    volunteerId: pg.integer(FieldNames.VOLUNTEER_ID).notNull(),
    message: pg.varchar(FieldNames.MESSAGE, { length: 256 }),
    status: applicationStatusEnum(FieldNames.APPLICATION_STATUS)
      .default(ApplicationStatus.PENDING)
      .notNull(),
    createdAt: pg.timestamp(FieldNames.CREATED_AT).defaultNow().notNull(),
    updatedAt: pg
      .timestamp(FieldNames.UPDATED_AT)
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    pg.foreignKey({
      columns: [table.listingId],
      foreignColumns: [listings.id],
      name: "fk_applications_listing_id",
    }),
    pg.foreignKey({
      columns: [table.volunteerId],
      foreignColumns: [users.id],
      name: "fk_applications_volunteer_id",
    }),
    pg
      .uniqueIndex("unique_application_per_volunteer")
      .on(table.listingId, table.volunteerId),
    pg.index("idx_applications_listing_id").on(table.listingId),
    pg.index("idx_applications_volunteer_id").on(table.volunteerId),
  ],
);

export const newApplicationBodySchema = createInsertSchema(applications);
