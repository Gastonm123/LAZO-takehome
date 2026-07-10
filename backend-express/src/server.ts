import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createApp } from "./app.js";
import { logger } from "./lib/logging.js";

dotenv.config();

export const app = createApp();

const port = process.env.BACKEND_PORT || 3000;
const isDirectRun =
    process.argv[1] !== undefined &&
    fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
    app.listen(port, () => {
        logger.log(`Server running on port ${port}`)
        if (process.env.NODE_ENV) {
            logger.log(`Running in mode ${process.env.NODE_ENV}`)
        }
    });
}
