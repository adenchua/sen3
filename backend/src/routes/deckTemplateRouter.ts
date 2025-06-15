import { Router } from "express";

import createDeckTemplateController from "../controllers/deck-template-controllers/createDeckTemplate";
import getDeckTemplatesController from "../controllers/deck-template-controllers/getDeckTemplates";
import validationMiddleware from "../middlewares/validationMiddleware";

const deckTemplateRouter = Router();

deckTemplateRouter.get(
  "/",
  getDeckTemplatesController.validator,
  validationMiddleware,
  getDeckTemplatesController.controller,
);

deckTemplateRouter.post(
  "/",
  createDeckTemplateController.validator,
  validationMiddleware,
  createDeckTemplateController.controller,
);

export default deckTemplateRouter;
