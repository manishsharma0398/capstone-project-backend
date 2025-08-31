import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Standalone database credentials for Drizzle Kit

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  verbose: true,
  strict: true,
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: process.env.NODE_ENV === "production",
  },
});
