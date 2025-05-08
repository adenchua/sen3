import { Router } from "express";

import databaseHealthCheck from "../controllers/healthcheck-controllers/databaseHealthCheck";
import healthCheck from "../controllers/healthcheck-controllers/healthCheck";
import telegramServiceHealthCheck from "../controllers/healthcheck-controllers/telegramServiceHealthCheck";

const healthCheckRouter = Router();

healthCheckRouter.get("/telegram-service", telegramServiceHealthCheck);
healthCheckRouter.get("/database", databaseHealthCheck);
healthCheckRouter.get("/", healthCheck);

export default healthCheckRouter;
