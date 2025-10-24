import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user";

enum FieldNames {
  ID = "id",
  TITLE = "title",
  DESCRIPTION = "description",
  LISTING_TYPE = "listing_type",
  STATUS = "status",
  ORGANIZATION_ID = "organization_id",
  LOCATION = "location",
  EXTRA_DATA = "extra_data",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export enum ListingType {
  VOLUNTEER_OPPORTUNITY = "volunteer_opportunity",
  DONATION_REQUEST = "donation_request",
  EVENT = "event",
  JOB = "job",
}

export enum ListingStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  CLOSED = "closed",
  DRAFT = "draft",
}

export const listingTypes = Object.values(ListingType) as [string, ...string[]];
export const listingStatus = Object.values(ListingStatus) as [
  string,
  ...string[],
];

export const listingTypeEnum = pg.pgEnum("listings_type_enum", listingTypes);
export const listingStatusEnum = pg.pgEnum(
  "listings_status_enum",
  listingStatus,
);

export const listings = pg.pgTable(
  "listings",
  {
    id: pg.serial(FieldNames.ID).primaryKey().notNull(),
    title: pg.varchar(FieldNames.TITLE, { length: 256 }).notNull(),
    description: pg.text(FieldNames.DESCRIPTION).notNull(),
    listingStatus: listingStatusEnum(FieldNames.STATUS)
      .default(ListingStatus.DRAFT)
      .notNull(),
    listingType: listingTypeEnum(FieldNames.LISTING_TYPE).notNull(),
    organizationId: pg.integer(FieldNames.ORGANIZATION_ID).notNull(),
    location: pg.varchar(FieldNames.LOCATION, { length: 255 }),
    extraData: pg.jsonb(FieldNames.EXTRA_DATA),
    createdAt: pg.timestamp(FieldNames.CREATED_AT).defaultNow().notNull(),
    updatedAt: pg
      .timestamp(FieldNames.UPDATED_AT)
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    pg.foreignKey({
      columns: [table.organizationId],
      foreignColumns: [users.id],
      name: "fk_listings_organization_id",
    }),
    pg.index("idx_listings_organization_id").on(table.organizationId),
    pg.index("idx_listings_status").on(table.listingStatus),
    pg.index("idx_listings_type").on(table.listingType),
  ],
);

export const newListingBodySchema = createInsertSchema(listings);
