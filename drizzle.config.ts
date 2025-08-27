import { Env } from "./src/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  verbose: true,
  strict: true,
  driver: "pglite",
  dbCredentials: {
    url: Env.DATABASE_URL,
  },
});
