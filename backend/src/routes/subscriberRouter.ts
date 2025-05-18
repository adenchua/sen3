import { Router } from "express";

import getDecksBySubscriberIdController from "../controllers/deck-controllers/getDecksBySubscriberId";
import createSubscriberController from "../controllers/subscriber-controllers/createSubscriber";
import getSubscriberByIdController from "../controllers/subscriber-controllers/getSubscriberById";
import getSubscribersController from "../controllers/subscriber-controllers/getSubscribers";
import updateSubscriberController from "../controllers/subscriber-controllers/updateSubscriber";
import validationMiddleware from "../middlewares/validationMiddleware";

const subscriberRouter = Router();

subscriberRouter.post(
  "/",
  createSubscriberController.validator,
  validationMiddleware,
  createSubscriberController.controller,
);
subscriberRouter.get(
  "/",
  getSubscribersController.validator,
  validationMiddleware,
  getSubscribersController.controller,
);
subscriberRouter.get("/:id", getSubscriberByIdController.controller);
subscriberRouter.patch(
  "/:id",
  updateSubscriberController.validator,
  validationMiddleware,
  updateSubscriberController.controller,
);

subscriberRouter.get(
  "/:id/decks",
  getDecksBySubscriberIdController.validator,
  validationMiddleware,
  getDecksBySubscriberIdController.controller,
);

export default subscriberRouter;
