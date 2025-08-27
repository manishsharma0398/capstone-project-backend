import app from "@/app";

// configs
import { Env, logger } from "@/config";

app.listen(Env.PORT, () => {
  logger.info(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
