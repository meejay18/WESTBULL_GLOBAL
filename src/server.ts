import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { logger } from "./utils/logger";

export const startServer = async () => {
  try {
    await prisma.$connect();

    logger.info("Database connected successfully");

    app.listen(env.port, "0.0.0.0", () => {
      logger.info(
    { port: env.port, environment: env.node_env },
    'Application started',
  )
    });
  } catch (error) {
    logger.error(error, "Failed to connect to database");
    process.exit(1);
  }
};

startServer();
