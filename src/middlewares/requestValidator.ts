import type { ErrorListItem, ErrorRequestHandler } from "express-zod-safe";

// config
import { logger } from "@/config";

// utils
import { ApiResponse } from "@/utils";

/**
 * Shared validation error handler
 */
export const validationErrorHandler: ErrorRequestHandler = (
  errors: ErrorListItem[] | undefined,
  _req,
  res,
  _next
) => {
  if (!errors) return;

  logger.error("error", errors);

  const formatted = errors.flatMap((err) =>
    err.errors.issues.map((zErr) => ({
      field: `${err.type}.${zErr.path.join(".")}`,
      message: zErr.message,
      code: zErr.code,
    }))
  );

  ApiResponse.error({
    res,
    errors: formatted,
    message: "Validation Failed",
  });
};
