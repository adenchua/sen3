import { Router } from "express";

import createDeck, { createDeckValidationChains } from "../controllers/deck-controllers/createDeck";
import getDecksBySubscriberId, {
  getDecksBySubscriberIdValidationChains,
} from "../controllers/deck-controllers/getDecksBySubscriberId";
import updateDeck, { updateDeckValidationChains } from "../controllers/deck-controllers/updateDeck";
import createSubscriber, {
  createSubscriberValidationChains,
} from "../controllers/subscriber-controllers/createSubscriber";
import validationMiddleware from "../middlewares/validationMiddleware";

const subscriberRouter = Router();

subscriberRouter.post(
  "/",
  createSubscriberValidationChains,
  validationMiddleware,
  createSubscriber,
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

export default subscriberRouter;
