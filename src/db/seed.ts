import { getTableName, sql, Table } from "drizzle-orm";

import { db, pool } from "@/db";
import { Env } from "@/config";
import * as schema from "@/db/schema";
import * as seeds from "./seeds";

if (!Env.IS_DB_SEEDING) {
  throw new Error("You must set IS_DB_SEEDING to true when running seeds");
}

async function resetTable(db: db, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  );
}

const startDBSeeding = async () => {
  for (const table of [schema.users]) {
    await resetTable(db, table);
  }

  await seeds.user(db);

  await pool.end();
};

startDBSeeding();
