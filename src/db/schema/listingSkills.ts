import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { skills } from "./skills";
import { listings } from "./listings";

enum FieldNames {
  ID = "id",
  LISTING_ID = "listing_id",
  SKILL_ID = "skill_id",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export const listingSkills = pg.pgTable(
  "listing_skills",
  {
    id: pg.serial(FieldNames.ID).primaryKey().notNull(),
    listingId: pg.integer(FieldNames.LISTING_ID).notNull(),
    skillId: pg.integer(FieldNames.SKILL_ID).notNull(),
    createdAt: pg.timestamp(FieldNames.CREATED_AT).defaultNow().notNull(),
    updatedAt: pg
      .timestamp(FieldNames.UPDATED_AT)
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    pg.foreignKey({
      columns: [table.listingId],
      foreignColumns: [listings.id],
      name: "fk_listing_skills_listing_id",
    }),
    pg.foreignKey({
      columns: [table.skillId],
      foreignColumns: [skills.id],
      name: "fk_listing_skills_skill_id",
    }),
    pg.index("idx_listing_skills_listing_id").on(table.listingId),
    pg.index("idx_listing_skills_skill_id").on(table.skillId),
    // Prevent duplicate skill entries for same listing
    pg.uniqueIndex("unique_listing_skill").on(table.listingId, table.skillId),
  ],
);

export const newListingSkillBodySchema = createInsertSchema(listingSkills).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
);
