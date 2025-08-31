import { defineConfig } from "drizzle-kit";
import "dotenv/config";

// Standalone database credentials for Drizzle Kit
const dbCredentials = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: process.env.IS_DB_MIGRATING === "true" ? 1 : undefined,
};

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  verbose: true,
  strict: true,
  dbCredentials,
});
