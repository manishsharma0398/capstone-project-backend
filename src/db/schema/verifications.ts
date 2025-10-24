import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { users } from "./user";

enum FieldNames {
  ID = "id",
  USER_ID = "user_id",
  VERIFICATION_TYPE = "verification_type",
  TOKEN = "token",
  IS_USED = "is_used",
  USED_AT = "used_at",
  EXPIRES_AT = "expires_at",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export enum VerificationType {
  MOBILE_NUMBER_VERIFICATION = "mobile_number_verification",
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_RESET = "password_reset",
}

export const verificationTypes = Object.values(VerificationType) as [
  string,
  ...string[],
];
export const verificationTypeEnum = pg.pgEnum(
  "verifications_type_enum",
  verificationTypes,
);

export const verifications = pg.pgTable(
  "verifications",
  {
    id: pg.serial(FieldNames.ID).primaryKey().notNull(),
    userId: pg.integer(FieldNames.USER_ID).notNull(),
    type: verificationTypeEnum(FieldNames.VERIFICATION_TYPE).notNull(),
    token: pg.varchar(FieldNames.TOKEN, { length: 256 }).unique().notNull(),
    isUsed: pg.boolean(FieldNames.IS_USED).default(false).notNull(),
    usedAt: pg.timestamp(FieldNames.USED_AT),
    expiresAt: pg
      .timestamp(FieldNames.EXPIRES_AT)
      .notNull()
      .default(sql`CURRENT_TIMESTAMP + INTERVAL '15 minutes'`),
    createdAt: pg.timestamp(FieldNames.CREATED_AT).defaultNow().notNull(),
    updatedAt: pg
      .timestamp(FieldNames.UPDATED_AT)
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    pg.index("verification_userId_idx").on(table.userId),
    pg.foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_verifications_user_id",
    }),
    pg.check("expires_in_future", sql`expires_at > CURRENT_TIMESTAMP`),
  ],
);
