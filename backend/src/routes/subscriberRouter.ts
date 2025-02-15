import { Router } from "express";

import createDeck, { createDeckValidationChains } from "../controllers/deck-controllers/createDeck";
import getDeckById from "../controllers/deck-controllers/getDeckById";
import getDecksBySubscriberId, {
  getDecksBySubscriberIdValidationChains,
} from "../controllers/deck-controllers/getDecksBySubscriberId";
import updateDeck, { updateDeckValidationChains } from "../controllers/deck-controllers/updateDeck";
import createSubscriber, {
  createSubscriberValidationChains,
} from "../controllers/subscriber-controllers/createSubscriber";
import getSubscriberById from "../controllers/subscriber-controllers/getSubscriberById";
import getSubscribers, {
  getSubscribersValidationChains,
} from "../controllers/subscriber-controllers/getSubscribers";
import updateSubscriber, {
  updateSubscriberValidationChains,
} from "../controllers/subscriber-controllers/updateSubscriber";
import validationMiddleware from "../middlewares/validationMiddleware";

const subscriberRouter = Router();

subscriberRouter.post(
  "/",
  createSubscriberValidationChains,
  validationMiddleware,
  createSubscriber,
);
subscriberRouter.get("/", getSubscribersValidationChains, validationMiddleware, getSubscribers);
subscriberRouter.get("/:id", getSubscriberById);
subscriberRouter.patch(
  "/:id",
  updateSubscriberValidationChains,
  validationMiddleware,
  updateSubscriber,
);

subscriberRouter.post("/:id/decks", createDeckValidationChains, validationMiddleware, createDeck);
subscriberRouter.get(
  "/:id/decks",
  getDecksBySubscriberIdValidationChains,
  validationMiddleware,
  getDecksBySubscriberId,
);
subscriberRouter.patch(
  "/:id/decks/:deckId",
  updateDeckValidationChains,
  validationMiddleware,
  updateDeck,
);
subscriberRouter.get("/:id/decks/:deckId", getDeckById);

export default subscriberRouter;
