import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const rolesEnum = pg.pgEnum("roles", ["ngo", "volunteer", "admin"]);
export const providersEnum = pg.pgEnum("providers", [
  "google",
  "local",
  "phone",
]);

export const users = pg.pgTable(
  "users",
  {
    id: pg.serial("id").primaryKey().unique().notNull(),
    email: pg.varchar("email").unique(),
    phone: pg.varchar("phone").unique(),
    firstName: pg.varchar("first_name", { length: 256 }),
    lastName: pg.varchar("last_name", { length: 256 }),
    role: rolesEnum("role").default("volunteer").notNull(),
    provider: providersEnum("provider").default("local").notNull(),
    passwordHash: pg.text("password_hash"),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    isEmailVerified: pg.boolean("is_email_verified").default(false),
    emailVerifiedAt: pg.timestamp("email_verified_at"),
    isPhoneVerified: pg.boolean("is_phone_verified").default(false),
    phoneVerifiedAt: pg.timestamp("phone_verified_at"),
  },
  (table) => [
    pg.uniqueIndex("id_idx").on(table.id),
    pg.uniqueIndex("email_idx").on(table.email),
    pg.check(
      "email_required_if_not_phone",
      sql`provider = 'phone' OR email IS NOT NULL`
    ),
    pg.check(
      "name_required_if_not_phone",
      sql`provider = 'phone' OR (first_name IS NOT NULL AND last_name IS NOT NULL)`
    ),
    pg.check(
      "password_provider_check",
      sql`(provider IN ('google', 'phone') AND password_hash IS NULL) OR (provider = 'local' AND password_hash IS NOT NULL)`
    ),
  ]
);

export const emailRegistrationBodySchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});
