import app from "@/app";

// db
import { pool } from "@/db";

// configs
import { Env, logger } from "@/config";

const server = app.listen(Env.PORT, () => {
  logger.info(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});

// Graceful shutdown handler
const shutdown = async (signal: string) => {
  logger.info(`Received shutdown ${signal}. Closing gracefully`);

  // Add timeout for existing connections (10s)
  const drainTimer = setTimeout(() => {
    logger.warn("Connection drain timeout reached, forcing shutdown");
    process.exit(1);
  }, 10000);

  try {
    server.close(async (err) => {
      if (err) {
        logger.error("Error closing server", err);
        process.exit(1);
      }
      logger.info("HTTP server closed");

      // Close DB pool
      await pool.end();
      logger.info("Database pool closed");

      clearTimeout(drainTimer);
      process.exit(0);
    });
  } catch (err) {
    logger.error("Error during shutdown", err);
    process.exit(1);
  }

  // Force shutdown after 30 seconds (fallback)
  setTimeout(() => {
    logger.error("Forcefully shutting down after 30s");
    process.exit(1);
  }, 30000);
};

// Listen for termination signals
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default server;
