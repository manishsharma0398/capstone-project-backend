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

export const resetPasswordToken: SchemaObject = {
  schema: {
    body: z.object({
      email: z.email(),
    }),
  },
  openapi: {
    summary: "Generate reset password token",
    description: "Generate reset password token for a user with email",
    tags: ["Auth"],
  },
};

export const setNewPassword: SchemaObject = {
  schema: {
    body: z
      .object({
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        token: z
          .string()
          .trim()
          .toLowerCase()
          .length(64 * 2),
      })
      .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
          ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
          });
        }
      }),
  },
  openapi: {
    summary: "set new password",
    description: "Set new password for local provider",
    tags: ["Auth"],
  },
};
