import type { ErrorListItem, ErrorRequestHandler } from "express-zod-safe";

// utils
import { ApiResponse } from "@/utils";

/**
 * Shared validation error handler
 */
export const validationErrorHandler: ErrorRequestHandler = (
  errors: ErrorListItem[] | undefined,
  req,
  res,
  _next
) => {
  if (!errors) return;

  const formatted = errors.flatMap((err) =>
    err.errors.issues.map((zErr) => ({
      field: `${err.type}.${zErr.path.join(".")}`,
      message: zErr.message,
      code: zErr.code,
    }))
  );

  ApiResponse.error({
    req,
    res,
    errors: formatted,
    message: "Validation Failed",
  });
};
