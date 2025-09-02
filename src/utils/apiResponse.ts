import type { Response, Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// config
import { Env, logger } from "@/config";

// types
import { CustomStatusCodes } from "./statusCodes";

type AnyRequest = Request<any, any, any, any>;

type SuccessParams<T = unknown> = {
  req: AnyRequest;
  res: Response;
  message?: string;
  data?: T;
  statusCode?: StatusCodes;
  code?: ReasonPhrases | CustomStatusCodes;
};

type ErrorParams<E = unknown> = {
  req: AnyRequest;
  res: Response;
  message: string;
  statusCode?: StatusCodes;
  code?: ReasonPhrases | CustomStatusCodes;
  errors?: E | E[] | Record<string, any>[] | Error;
};

export class ApiResponse {
  static success<T>({
    req,
    res,
    data,
    message = "Success",
    code = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
  }: SuccessParams<T>): Response {
    const response = {
      success: true,
      message,
      data,
    };

    const apiRes = {
      code,
      requestId: req.requestId,
      ...response,
    };

    logger.info("Outgoing Response", {
      method: req.method,
      url: req.originalUrl,
      status: statusCode,
      context: "HttpResponse",
      event: "outgoing",
      duration: `${Date.now() - req.startTime}ms`,
      contentLength: Buffer.byteLength(JSON.stringify(apiRes)),
      response,
    });

    return res.status(statusCode).json(apiRes);
  }

  static error<E>({
    res,
    req,
    errors,
    message,
    code = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  }: ErrorParams<E>): Response {
    const response: Record<string, unknown> = {
      success: false,
      message,
      ...(code && { code }),
      ...(errors && !(errors instanceof Error) && { errors }),
      ...(Env.NODE_ENV === "development" &&
        errors instanceof Error && { stack: errors.stack }),
    };

    const apiRes = {
      requestId: req.requestId,
      ...response,
    };

    logger.error("Outgoing Response (Error)", {
      method: req.method,
      url: req.originalUrl,
      status: statusCode,
      duration: `${Date.now() - req.startTime}ms`,
      contentLength: Buffer.byteLength(JSON.stringify(apiRes)),
      context: "HttpResponse",
      event: "outgoing",
      ...(errors instanceof Error
        ? { errorMessage: errors.message }
        : errors && { errors }),
      response,
    });

    return res.status(statusCode).json(apiRes);
  }
}
