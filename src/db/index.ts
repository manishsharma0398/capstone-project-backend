import { Env } from "@/config";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";

export const db = drizzle({
  connection: {
    connectionString: Env.DATABASE_URL,
    ssl: Env.NODE_ENV === "production",
    max: undefined,
  },
  schema,
  logger: true,
});

export type db = typeof db;
export default db;
