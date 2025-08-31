import { StatusCodes, ReasonPhrases } from "http-status-codes";

// error codes
import type { CustomStatusCodes } from "./statusCodes";

interface AppErrorParams {
  message: string;
  details?: unknown;
  isOperational?: boolean;
  statusCode: StatusCodes;
  code?: ReasonPhrases | CustomStatusCodes;
}

export class AppError extends Error {
  public readonly details?: unknown;
  public readonly isOperational: boolean;
  public readonly statusCode: StatusCodes;
  public readonly code: ReasonPhrases | CustomStatusCodes;

  constructor({
    message,
    details,
    isOperational = true,
    code = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  }: AppErrorParams) {
    super(message);

    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;
