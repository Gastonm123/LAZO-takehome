import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import apiRoutes from "./routes/main.js";

export function createApp() {
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

    return app;
}
