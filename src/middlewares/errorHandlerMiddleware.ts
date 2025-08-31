import type { Request, Response, NextFunction } from "express";

// configs
import { logger } from "@/config";

// utils
import { ApiResponse, isAppError } from "@/utils";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (isAppError(error)) {
    // Operational errorors → expected, log minimally
    logger.warn(`[${error.code}] ${error.message}`, { details: error.details });

    return ApiResponse.error({
      res,
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
      errors: error.details,
    });
  }

  // Non-operational → unexpected
  logger.error("Unexpected error", error);

  return ApiResponse.error({
    res,
    statusCode: 500,
    message: "Internal server error",
  });
};
