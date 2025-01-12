import { Router } from "express";

import createDeck, { createDeckValidationChains } from "../controllers/deck-controllers/createDeck";
import getDeckById from "../controllers/deck-controllers/getDeckById";
import getDecksBySubscriberId, {
  getDecksBySubscriberIdValidationChains,
} from "../controllers/deck-controllers/getDecksBySubscriberId";
import updateDeck, { updateDeckValidationChains } from "../controllers/deck-controllers/updateDeck";
import approveSubscriber from "../controllers/subscriber-controllers/approveSubscriber";
import createSubscriber, {
  createSubscriberValidationChains,
} from "../controllers/subscriber-controllers/createSubscriber";
import getSubscribers, {
  getSubscribersValidationChains,
} from "../controllers/subscriber-controllers/getSubscribers";
import validationMiddleware from "../middlewares/validationMiddleware";

const subscriberRouter = Router();

subscriberRouter.post(
  "/",
  createSubscriberValidationChains,
  validationMiddleware,
  createSubscriber,
);
subscriberRouter.get("/", getSubscribersValidationChains, validationMiddleware, getSubscribers);
subscriberRouter.post("/:id/approve", approveSubscriber);

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
