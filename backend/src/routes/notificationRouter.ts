import { Router } from "express";

import createNotificationController from "../controllers/notification-controllers/createNotification";
import validationMiddleware from "../middlewares/validationMiddleware";

const notificationRouter = Router();

notificationRouter.post(
  "/",
  createNotificationController.validator,
  validationMiddleware,
  createNotificationController.controller,
);

export default notificationRouter;
