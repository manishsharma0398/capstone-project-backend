import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { dbConfig } from "./config";
import * as schema from "@/db/schema";

export const pool = new Pool(dbConfig);

export const db = drizzle(pool, {
  schema,
  logger: true,
});

export type db = typeof db;
export default db;
