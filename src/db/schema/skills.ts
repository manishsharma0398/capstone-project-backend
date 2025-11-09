import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

enum FieldNames {
  ID = "id",
  TITLE = "title",
  DESCRIPTION = "description",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export const skills = pg.pgTable("skills", {
  id: pg.serial(FieldNames.ID).primaryKey().notNull(),
  title: pg.varchar(FieldNames.TITLE, { length: 256 }).notNull().unique(),
  description: pg.text(FieldNames.DESCRIPTION),
  createdAt: pg.timestamp(FieldNames.CREATED_AT).defaultNow().notNull(),
  updatedAt: pg
    .timestamp(FieldNames.UPDATED_AT)
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const newSkillBodySchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
