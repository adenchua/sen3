import { Router } from "express";

import createDeckController from "../controllers/deck-controllers/createDeck";
import getDeckByIdController from "../controllers/deck-controllers/getDeckById";
import updateDeckController from "../controllers/deck-controllers/updateDeck";
import validationMiddleware from "../middlewares/validationMiddleware";
import deleteDeckController from "../controllers/deck-controllers/deleteDeck";

const deckRouter = Router();

deckRouter.post(
  "/",
  createDeckController.validator,
  validationMiddleware,
  createDeckController.controller,
);

deckRouter.patch(
  "/:id",
  updateDeckController.validator,
  validationMiddleware,
  updateDeckController.controller,
);

deckRouter.delete(
  "/:id",
  deleteDeckController.validator,
  validationMiddleware,
  deleteDeckController.controller,
);

deckRouter.get("/:id", getDeckByIdController.controller);

export default deckRouter;
