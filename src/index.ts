import app from "@/app";

// configs
import { ENV, logger } from "@/config";

app.listen(ENV.PORT, () => {
  logger.info(`Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});
