import type { Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// config
import { Env, logger } from "@/config";

// types
import { CustomStatusCodes } from "./statusCodes";

type SuccessParams<T = unknown> = {
  res: Response;
  message?: string;
  data?: T;
  statusCode?: StatusCodes;
  code?: ReasonPhrases | CustomStatusCodes;
};

type ErrorParams<E = unknown> = {
  res: Response;
  message: string;
  logError?: boolean;
  statusCode?: StatusCodes;
  code?: ReasonPhrases | CustomStatusCodes;
  errors?: E | E[] | Record<string, any>[] | Error;
};

export class ApiResponse {
  static success<T>({
    res,
    data,
    message = "Success",
    code = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
  }: SuccessParams<T>): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      code,
    });
  }

  static error<E>({
    res,
    errors,
    message,
    logError = false,
    code = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  }: ErrorParams<E>): void {
    const response: Record<string, unknown> = {
      success: false,
      message,
      ...(code && { code }),
      ...(errors && !(errors instanceof Error) && { errors }),
      ...(Env.NODE_ENV === "development" &&
        errors instanceof Error && { stack: errors.stack }),
    };

    if (logError) {
      logger.error(message, { response, statusCode });
    }

    res.status(statusCode).json(response);
  }
}
