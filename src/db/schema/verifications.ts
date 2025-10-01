import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { users } from "./user";

export const verificationTypeEnum = pg.pgEnum("verificationType", [
  "mobile_number_verification",
  "email_verification",
  "password_reset",
]);

export const verifications = pg.pgTable(
  "verifications",
  {
    id: pg.serial("id").primaryKey().notNull(),
    userId: pg.integer("user_id").notNull(),

    type: verificationTypeEnum("verification_type").notNull(),
    token: pg.varchar("token", { length: 256 }).notNull(),
    isUsed: pg.boolean("is_used").default(false).notNull(),

    usedAt: pg.timestamp("used_at", { withTimezone: true }),
    expiresAt: pg
      .timestamp("expires_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP + INTERVAL '15 minutes'`),
    createdAt: pg.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: pg
      .timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    pg.index("verification_userId_idx").on(table.userId),
    pg.foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_verifications_user_id",
    }),
  ],
);
