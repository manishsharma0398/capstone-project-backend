import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// db
import { emailRegistrationBodySchema } from "@/db/schema";

import { validationErrorHandler } from "@/middlewares";

extendZodWithOpenApi(z);

export const createUserFromEmailSchema = {
  body: emailRegistrationBodySchema
    .extend({ password: z.string().min(6) })
    .strict(),
  handler: validationErrorHandler,
};
