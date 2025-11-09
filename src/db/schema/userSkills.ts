import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user";
import { skills } from "./skills";

export enum ExperienceLevel {
  BEGINNER = "beginner",
  MEDIUM = "medium",
  ADVANCED = "advanced",
}

export const experienceLevelTypes = Object.values(ExperienceLevel) as [
  string,
  ...string[],
];
export const experienceTypeEnum = pg.pgEnum(
  "user_experience_level_enum",
  experienceLevelTypes,
);

enum FieldNames {
  ID = "id",
  USER_ID = "user_id",
  SKILL_ID = "skill_id",
  EXPERIENCE_LEVeL = "user_experience_level",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export const userSkills = pg.pgTable(
  "user_skills",
  {
    id: pg.serial(FieldNames.ID).primaryKey().notNull(),
    userId: pg.integer(FieldNames.USER_ID).notNull(),
    skillId: pg.integer(FieldNames.SKILL_ID).notNull(),
    experienceLevel: experienceTypeEnum(FieldNames.EXPERIENCE_LEVeL)
      .default(ExperienceLevel.BEGINNER)
      .notNull(),
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
      name: "fk_user_skills_user_id",
    }),
    pg.foreignKey({
      columns: [table.skillId],
      foreignColumns: [skills.id],
      name: "fk_user_skills_user_id",
    }),
    pg.index("idx_user_skills_organization_id").on(table.userId),
    pg.index("idx_user_skills_status").on(table.skillId),
    // one user cannot have same skill twice
    pg.uniqueIndex("unique_user_skill").on(table.userId, table.skillId),
  ],
);

export const newUserSkillBodySchema = createInsertSchema(userSkills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
