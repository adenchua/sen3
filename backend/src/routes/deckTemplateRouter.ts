import { Router } from "express";

import createDeckTemplateController from "../controllers/deck-template-controllers/createDeckTemplate";
import getDeckTemplatesController from "../controllers/deck-template-controllers/getDeckTemplates";
import updateDeckTemplateController from "../controllers/deck-template-controllers/updateDeckTemplate";
import validationMiddleware from "../middlewares/validationMiddleware";
import getDeckTemplateByIdController from "../controllers/deck-template-controllers/getDeckTemplateById";

const deckTemplateRouter = Router();

deckTemplateRouter.get(
  "/",
  getDeckTemplatesController.validator,
  validationMiddleware,
  getDeckTemplatesController.controller,
);

deckTemplateRouter.get(
  "/:id",
  getDeckTemplateByIdController.validator,
  validationMiddleware,
  getDeckTemplateByIdController.controller,
);

deckTemplateRouter.post(
  "/",
  createDeckTemplateController.validator,
  validationMiddleware,
  createDeckTemplateController.controller,
);

deckTemplateRouter.patch(
  "/:id",
  updateDeckTemplateController.validator,
  validationMiddleware,
  updateDeckTemplateController.controller,
);

export default deckTemplateRouter;
