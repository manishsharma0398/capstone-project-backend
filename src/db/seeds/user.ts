import type db from "@/db";
import * as schema from "@/db/schema";
import users from "./data/users.json" with { type: "json" };

export default async function seed(db: db) {
  await Promise.all(
    users.map(async ({ email, first_name, id, last_name, role }) => {
      await db
        .insert(schema.users)
        .values({
          email,
          firstName: first_name,
          lastName: last_name,
          id,
          role: role as (typeof schema.rolesEnum.enumValues)[number],
        })
        .returning();
    })
  );
}
