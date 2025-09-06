import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// db
import { emailRegistrationBodySchema } from "@/db/schema";
import type { SchemaObject } from "@/utils";

extendZodWithOpenApi(z);

export const createUserFromEmailSchema: SchemaObject = {
  schema: {
    body: emailRegistrationBodySchema.extend({ password: z.string().min(6) }),
  },
  openapi: {
    summary: "Register user with email",
    description: "Creates a user with email/password",
    tags: ["Auth"],
  },
};
