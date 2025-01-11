import { Router } from "express";

import createDeck, { createDeckValidationChains } from "../controllers/deck-controllers/createDeck";
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

export default subscriberRouter;
