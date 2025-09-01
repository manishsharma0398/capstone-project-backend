import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import express, { type ErrorRequestHandler } from "express";

// middlewares
import {
  requestId,
  errorHandler,
  notFoundHandler,
  loggingMiddleware,
} from "@/middlewares";

// routes
import { authRoutes } from "@/routes";

// utils
import { ApiResponse } from "@/utils";

// configs
import { corsOptions } from "@/config";
import passport, { initializePassport } from "@/config/strategies/passport";

// api-docs
import { specs, swaggerUiOptions } from "@/docs";

const app = express();

// middlewares

// Security
app.use(requestId);
app.use(cors({ ...corsOptions }));

// Performance
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
initializePassport();

// Monitoring
app.use(loggingMiddleware);

// Routes
app.get("/", (req, res) => {
  ApiResponse.success({
    req,
    res,
    message: "Hello from Community Connect Server!",
  });
});

// Health Check
app.get("/health", (req, res) => {
  ApiResponse.success({
    data: {
      status: "ok",
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    },
    req,
    res,
    message: "Health Check OK",
  });
});

// api docs
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(specs, swaggerUiOptions));

// other routes
app.use("/auth", authRoutes);

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return errorHandler(err, req, res, next);
};

app.use(errorMiddleware);

app.use(notFoundHandler);

export default app;
