import { StatusCodes, ReasonPhrases } from "http-status-codes";

// error codes
import type { ErrorCode } from "./errorCodes";

interface AppErrorParams {
  message: string;
  statusCode: StatusCodes;
  code?: ReasonPhrases | ErrorCode;
  isOperational?: boolean;
  details?: unknown;
}

export class AppError extends Error {
  public readonly statusCode: StatusCodes;
  public readonly code: ReasonPhrases | ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor({
    message,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    code = ReasonPhrases.INTERNAL_SERVER_ERROR,
    isOperational = true,
    details,
  }: AppErrorParams) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;
