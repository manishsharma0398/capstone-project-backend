import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";
import { dbCredentials } from "./config";

export const pool = new Pool(dbCredentials);

export const db = drizzle(pool, {
  schema,
  logger: true,
});

export type db = typeof db;
export default db;
