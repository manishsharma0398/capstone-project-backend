import express, { type ErrorRequestHandler } from "express";

import {
  requestId,
  errorHandler,
  notFoundHandler,
  loggingMiddleware,
} from "@/middlewares";

const app = express();

app.use(requestId);
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.get("/", (_, res) => {
  res.json({ message: "Hello from Community Connect Server!" });
});

// Health Check
app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return errorHandler(err, req, res, next);
};

app.use(errorMiddleware);

// Add this as the last middleware (before error handler)
app.use(notFoundHandler);

export default app;
