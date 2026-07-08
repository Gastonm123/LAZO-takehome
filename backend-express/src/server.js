import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { logger } from "./lib/logging.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import apiRoutes from "./routes/main.js";

dotenv.config();

const port = process.env.BACKEND_PORT || 3000;
const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

const app = express();

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => logger.log(`Server running on port ${port}`));
