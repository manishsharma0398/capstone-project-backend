import "dotenv/config";
import { z, ZodError } from "zod";
import { logger } from "./logger";

const EnvSchema = z.object({
  PORT: z.coerce
    .number()
    .int()
    .min(1024, "Port must be >= 1024")
    .max(65535, "Port must be <= 65535")
    .default(8000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof EnvSchema>;

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => {
      const field = issue.path.map(String).join(".");
      return { field, reason: issue.message || issue.code };
    });

    logger.error("Missing or invalid values in .env", { issues });

    // still throw to stop the app from booting
    throw new Error(
      "Invalid environment configuration. Check logs for details."
    );
  } else {
    logger.error("Unexpected error while parsing env", { error });
    throw error;
  }
}

export const Env = EnvSchema.parse(process.env);
