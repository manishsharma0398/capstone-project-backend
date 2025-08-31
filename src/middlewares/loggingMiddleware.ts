import type { Request, Response, NextFunction } from "express";

// configs
import { logger } from "@/config";

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const logData = {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      context: "HttpRequest",
      requestId: req.requestId,
      userAgent: req.get("user-agent"),
      duration: `${Date.now() - startTime}ms`,
      query: Object.keys(req.query).length ? req.query : undefined,
      body: Object.keys(req.body || {}).length ? req.body : undefined,
    };

    if (res.statusCode === 404) {
      logger.error(`Route ${req.method} '${req.path}' not Found`, logData);
    } else if (res.statusCode >= 400) {
      logger.error("Request failed", logData);
    } else {
      logger.info("Request completed", logData);
    }
  });

  next();
};
