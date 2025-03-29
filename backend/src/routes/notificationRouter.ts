import { Router } from "express";

import createNotification, {
  createNotificationValidationChains,
} from "../controllers/notification-controllers/createNotification";
import validationMiddleware from "../middlewares/validationMiddleware";

const notificationRouter = Router();

notificationRouter.post(
  "/",
  createNotificationValidationChains,
  validationMiddleware,
  createNotification,
);

export default notificationRouter;
