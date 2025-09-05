import "dotenv/config";
import cors from "cors";
import "reflect-metadata";
import express, { type ErrorRequestHandler } from "express";

// middlewares
import {
  requestId,
  errorHandler,
  notFoundHandler,
  cookieMiddleware,
  loggingMiddleware,
} from "@/middlewares";

// configs
import { corsOptions, initializePassport, passport } from "@/config";

// modules
import { defineRoutes } from "@/modules";

// routes
import { MainRoutes, AuthRoutes } from "@/routes";

// docs
import { setupSwagger } from "@/docs";

const app = express();

// middlewares

// Security
app.use(requestId);
app.use(cors({ ...corsOptions }));

// Performance
app.use(express.json());
app.use(cookieMiddleware);
app.use(passport.initialize());
initializePassport();

// Monitoring
app.use(loggingMiddleware);

// Routes
defineRoutes([MainRoutes, AuthRoutes], app);

// Setup Swagger
setupSwagger(app);

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return errorHandler(err, req, res, next);
};

app.use(errorMiddleware);
app.use(notFoundHandler);

export default app;
