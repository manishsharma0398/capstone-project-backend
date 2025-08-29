import { defineConfig } from "drizzle-kit";

// configd
import { dbCredentials } from "@/db/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  verbose: true,
  strict: true,
  dbCredentials,
});
