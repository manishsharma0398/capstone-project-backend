import z from "zod";
import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

enum FieldNames {
  ID = "id",
  EMAIL = "email",
  PHONE = "phone",
  FIRST_NAME = "first_name",
  LAST_NAME = "last_name",
  ROLE = "role",
  PROVIDER = "provider",
  PASSWORD_HASH = "password_hash",
  IS_EMAIL_VERIFIED = "is_email_verified",
  EMAIL_VERIFIED_AT = "email_verified_at",
  IS_PHONE_VERIFIED = "is_phone_verified",
  PHONE_VERIFIED_AT = "phone_verified_at",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export enum Providers {
  GOOGLE = "google",
  LOCAL = "local",
  PHONE = "phone",
}

export enum UserRole {
  ORGANIZATION = "organization",
  VOLUNTEER = "volunteer",
  ADMIN = "admin",
}

export const allUserRoles = Object.values(UserRole) as [string, ...string[]];
export const providers = Object.values(Providers) as [string, ...string[]];

export const rolesEnum = pg.pgEnum("user_roles_enum", allUserRoles);
export const providersEnum = pg.pgEnum("providers_enum", providers);

export const users = pg.pgTable(
  "users",
  {
    id: pg.serial(FieldNames.ID).primaryKey().notNull(),
    email: pg.varchar(FieldNames.EMAIL, { length: 255 }).unique(),
    phone: pg.varchar(FieldNames.PHONE, { length: 10 }).unique(),
    firstName: pg.varchar(FieldNames.FIRST_NAME, { length: 256 }),
    lastName: pg.varchar(FieldNames.LAST_NAME, { length: 256 }),
    role: rolesEnum(FieldNames.ROLE).default(UserRole.VOLUNTEER).notNull(),
    provider: providersEnum(FieldNames.PROVIDER)
      .default(Providers.LOCAL)
      .notNull(),
    passwordHash: pg.text(FieldNames.PASSWORD_HASH),
    isEmailVerified: pg.boolean(FieldNames.IS_EMAIL_VERIFIED).default(false),
    emailVerifiedAt: pg.timestamp(FieldNames.EMAIL_VERIFIED_AT),
    isPhoneVerified: pg.boolean(FieldNames.IS_PHONE_VERIFIED).default(false),
    phoneVerifiedAt: pg.timestamp(FieldNames.PHONE_VERIFIED_AT),
    createdAt: pg.timestamp(FieldNames.CREATED_AT).defaultNow().notNull(),
    updatedAt: pg
      .timestamp(FieldNames.UPDATED_AT)
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  () => [
    pg.check(
      "email_required_if_not_phone",
      sql`provider = 'phone' OR email IS NOT NULL`,
    ),
    pg.check(
      "name_required_if_not_phone",
      sql`provider = 'phone' OR (first_name IS NOT NULL AND last_name IS NOT NULL)`,
    ),
    pg.check(
      "password_provider_check",
      sql`(provider IN ('google', 'phone') AND password_hash IS NULL) OR (provider = 'local' AND password_hash IS NOT NULL)`,
    ),
  ],
);

export const registerableUserRoles = allUserRoles.filter(
  (role) => role !== UserRole.ADMIN,
);

export const emailRegistrationBodySchema = createInsertSchema(users)
  .pick({
    email: true,
    firstName: true,
    lastName: true,
    role: true,
  })
  .extend({
    email: z.email().trim().toLowerCase(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.enum(registerableUserRoles).default(UserRole.VOLUNTEER).optional(),
  });
