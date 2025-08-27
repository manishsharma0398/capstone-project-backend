import * as pg from "drizzle-orm/pg-core";

const rolesEnum = pg.pgEnum("roles", ["ngo", "volunteer", "admin"]);

const users = pg.pgTable(
  "users",
  {
    id: pg.serial("id").primaryKey().unique().notNull(),
    email: pg.varchar("email").notNull().unique(),
    firstName: pg.varchar("first_name", { length: 256 }),
    lastName: pg.varchar("last_name", { length: 256 }),
    role: rolesEnum("role").default("volunteer").notNull(),
  },
  (table) => [
    pg.uniqueIndex("email_idx").on(table.email),
    pg.uniqueIndex("id_idx").on(table.id),
  ]
);

export default users;
