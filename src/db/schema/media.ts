import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user";

/**
 * ENUMS
 */
export enum MediaType {
  IMAGE = "image", // profile photos, event images, etc.
  VIDEO = "video", // promotional or recap videos
  AUDIO = "audio", // voice introductions, podcasts, interviews
  DOCUMENT = "document", // resumes, forms, certificates (PDF, DOCX)
  THUMBNAIL = "thumbnail", // auto-generated previews
  BANNER = "banner", // hero images for listings or profiles
  LOGO = "logo", // organization or partner logos
  ICON = "icon", // small symbolic assets
  OTHER = "other", // fallback for rare or untyped uploads
}

export const mediaTypes = Object.values(MediaType) as [string, ...string[]];
export const mediaTypeEnum = pg.pgEnum("media_enum", mediaTypes);

export enum MediaScope {
  LISTING = "listing", // attached to volunteer opportunities/events
  USER = "user", // user or volunteer profile images
  ORGANIZATION = "organization", // NGO/org profile & branding
  APPLICATION = "application", // volunteer application documents
  EVENT = "event", // media for specific events (photos/videos)
  MESSAGE = "message", // chat attachments or conversation media
  POST = "post", // feed or announcement images/videos
  BADGE = "badge", // reward/badge images for achievements
  SYSTEM = "system", // used internally by the app (default icons, banners)
}

export const mediaScopes = Object.values(MediaScope) as [string, ...string[]];
export const mediaScopeEnum = pg.pgEnum("media_scope_enum", mediaScopes);

/**
 * FIELD NAMES
 */
enum FieldNames {
  ID = "id",
  USER_ID = "user_id",
  ENTITY_ID = "entity_id",
  LISTING_ID = "listing_id",
  MEDIA_URL = "media_url",
  MEDIA_TYPE = "media_type",
  MEDIA_SCOPE = "media_scope",
  IS_PRIMARY = "is_primary",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

/**
 * TABLE: media
 */
export const media = pg.pgTable(
  "media",
  {
    id: pg.serial(FieldNames.ID).primaryKey().notNull(),
    userId: pg.integer(FieldNames.USER_ID).notNull(),
    entityId: pg.integer(FieldNames.ENTITY_ID).notNull(),
    mediaUrl: pg.varchar(FieldNames.MEDIA_URL, { length: 512 }).notNull(),
    mediaType: mediaTypeEnum(FieldNames.MEDIA_TYPE)
      .default(MediaType.IMAGE)
      .notNull(),
    mediaScope: mediaScopeEnum(FieldNames.MEDIA_SCOPE)
      .default(MediaScope.LISTING)
      .notNull(),
    isPrimary: pg.boolean(FieldNames.IS_PRIMARY).default(false).notNull(),
    createdAt: pg.timestamp(FieldNames.CREATED_AT).defaultNow().notNull(),
    updatedAt: pg
      .timestamp(FieldNames.UPDATED_AT)
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    pg.foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_media_user_id",
    }),

    // Indexes for faster filtering and lookups
    pg.index("idx_media_user_id").on(table.userId),
    pg.index("idx_media_scope").on(table.mediaScope),
    pg.index("idx_media_scope_entity").on(table.mediaScope, table.entityId),
    pg.index("idx_media_type").on(table.mediaType),
  ],
);

/**
 * ZOD Schema for validation
 */
export const newMediaBodySchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
