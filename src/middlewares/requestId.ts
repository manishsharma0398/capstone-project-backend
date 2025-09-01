import { v4 as uuidv4 } from "uuid";
import type { Request, Response, NextFunction } from "express";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  req.requestId = (req.headers["x-request-id"] as string) || uuidv4();
  res.setHeader("X-Request-ID", req.requestId);
  next();
};
