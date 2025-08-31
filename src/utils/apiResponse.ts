import type { Response } from "express";

// config
import { Env, logger } from "@/config";

type SuccessParams<T = unknown> = {
  res: Response;
  data?: T;
  statusCode?: number;
  message?: string;
};

type ErrorParams<E = unknown> = {
  res: Response;
  message: string;
  errors?: E | E[] | Record<string, any>[] | Error;
  statusCode?: number;
  code?: string;
  logError?: boolean;
};

export class ApiResponse {
  static success<T>({
    res,
    data,
    statusCode = 200,
    message = "Success",
  }: SuccessParams<T>): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error<E>({
    res,
    message,
    errors,
    statusCode = 400,
    code,
    logError = false,
  }: ErrorParams<E>): void {
    const response: Record<string, unknown> = {
      success: false,
      message,
      ...(code && { code }),
      ...(errors && !(errors instanceof Error) && { errors }),
      ...(Env.NODE_ENV === "development" &&
        errors instanceof Error && { stack: errors.stack }),
    };

    if (logError || statusCode >= 500) {
      logger.error(message, { response, statusCode });
    }

    res.status(statusCode).json(response);
  }
}
