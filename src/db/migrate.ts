import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db, pool } from "@/db";
import { Env } from "@/config";
import config from "$/drizzle.config";

if (!Env.IS_DB_MIGRATING) {
  throw new Error(
    "You must set IS_DB_MIGRATING to true when running migrations"
  );
}

const startDBMigration = async () => {
  await migrate(db, { migrationsFolder: config.out! });

  await pool.end();
};

startDBMigration();
