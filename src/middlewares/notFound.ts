import type { Request, Response } from "express";

// utils
import { ApiResponse } from "@/utils";

/**
 * Middleware to handle 404 Not Found errors
 * This should be mounted after all other routes
 */
export const notFoundHandler = (_: Request, res: Response) => {
  ApiResponse.error(res, "🔍 Ooops! Looks like you are lost. 🗺️", 404);
};
