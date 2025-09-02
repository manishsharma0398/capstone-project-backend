import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";

// utils
import { ApiResponse, isAppError } from "@/utils";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (isAppError(error)) {
    return ApiResponse.error({
      req,
      res,
      code: error.code,
      errors: error.details,
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  return ApiResponse.error({
    req,
    res,
    errors: error,
    message: "Unexpected error",
    code: ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });
};
