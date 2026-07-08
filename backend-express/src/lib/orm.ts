import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { logger } from "./logging.js";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_DATABASE ?? "obligations_tracker",
  process.env.DB_USERNAME ?? "postgres",
  process.env.DB_PASSWORD ?? "example",
  {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    pool: {
      max: Number(process.env.DB_POOL_SIZE) || 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: logger.log.bind(logger),
    dialect: "postgres",
  },
);

export const init = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.log("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw error;
  }
};
