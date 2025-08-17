import express from "express";
import { loggingMiddleware } from "@/middlewares/loggingMiddleware";
import { requestId } from "@/middlewares/requestId";
import { notFoundHandler } from "@/middlewares/notFound";

const app = express();

app.use(requestId);
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.get("/", (_, res) => {
  res.json({ message: "Hello from Community Connect Server!" });
});

// Add this as the last middleware (before error handler)
app.use(notFoundHandler);

export default app;
