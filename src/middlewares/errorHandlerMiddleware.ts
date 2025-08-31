import { ReasonPhrases, StatusCodes } from "http-status-codes";
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
      code: error.code,
      errors: error.details,
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  return ApiResponse.error({
    res,
    errors: error,
    logError: true,
    message: "Unexpected error",
    code: ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });
};
