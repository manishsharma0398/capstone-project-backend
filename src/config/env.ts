import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z
    .string()
    .transform(Number)
    .refine((n) => n >= 1024 && n <= 65535, {
      message: "Port must be between 1024 and 65535",
    }),
  NODE_ENV: z.enum(["development", "production"]),
});

export const ENV = envSchema.parse(process.env);

// Add validations
const requiredFields: Array<string> = ["PORT", "NODE_ENV"];

requiredFields.forEach((field) => {
  if (!process.env?.[field]) {
    throw new Error(`Missing required env variable: ${field}`);
  }
});
