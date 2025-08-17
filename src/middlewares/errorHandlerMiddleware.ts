import { Request, Response, NextFunction } from "express";

// configs
import { logger } from "@/config";

// utils
import { ApiResponse, AppError } from "@/utils";

export const errorHandler = (
  error: Error,
  _: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error({
    message: error.message,
    stack: error.stack,
    context: "ErrorHandler",
  });

  if (error instanceof AppError) {
    ApiResponse.error(res, error.message, error.statusCode);
    return;
  }

  ApiResponse.error(res, "Internal server error", 500);
};
