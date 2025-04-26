import { buildApp } from "./app";
import { envConfig } from "./config";

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      port: envConfig.PORT,
      host: envConfig.HOST,
    });
    app.log.info(`Server is running on ${envConfig.HOST}:${envConfig.PORT}`);

    if (envConfig.NODE_ENV !== "production") {
      app.log.info(
        `API documentation available at ${envConfig.HOST}:${envConfig.PORT}/documentation`
      );
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export { start };
