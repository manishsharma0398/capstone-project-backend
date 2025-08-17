import cors from "cors";
import swaggerUi from "swagger-ui-express";
import express, { type ErrorRequestHandler } from "express";

// middlewares
import {
  requestId,
  errorHandler,
  notFoundHandler,
  loggingMiddleware,
} from "@/middlewares";
import { corsOptions } from "@/config";
import { specs, swaggerUiOptions } from "@/docs";

const app = express();

// middlewares

// Security
app.use(requestId);
app.use(cors({ ...corsOptions }));

// Performance
app.use(express.json());

// Monitoring
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

// api docs
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(specs, swaggerUiOptions));

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return errorHandler(err, req, res, next);
};

app.use(errorMiddleware);

app.use(notFoundHandler);

export default app;
