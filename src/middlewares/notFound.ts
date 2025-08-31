import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";

// utils
import { ApiResponse, CustomStatusCodes } from "@/utils";

/**
 * Middleware to handle 404 Not Found errors
 * This should be mounted after all other routes
 */
export const notFoundHandler = (_: Request, res: Response) => {
  ApiResponse.error({
    res,
    logError: true,
    statusCode: StatusCodes.NOT_FOUND,
    code: CustomStatusCodes.ROUTE_NOT_EXISTS,
    message: "🔍 Ooops! Looks like you are lost. 🗺️",
  });
};
