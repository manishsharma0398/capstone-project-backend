import type { Request, Response, NextFunction } from "express";

// configs
import { logger } from "@/config";

const sensitiveKeys = [
  "password",
  "token",
  "authorization",
  "secret",
  "apikey",
];

const sanitizeBody = (body: Record<string, any>) => {
  const clone = { ...body };
  for (const key of sensitiveKeys) {
    if (clone[key]) clone[key] = "[REDACTED]";
  }
  return clone;
};

export const loggingMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  logger.info("Incoming Request", {
    ip: req?.ip,
    method: req?.method,
    url: req?.originalUrl,
    userAgent: req?.get("user-agent"),
    body: Object.keys(req?.body || {}).length
      ? sanitizeBody(req?.body)
      : undefined,
    query: Object.keys(req?.query)?.length ? req?.query : undefined,
    context: "HttpRequest",
    event: "incoming",
  });

  next();
};
