import { Router } from "express";

import getCountController from "../controllers/analytics-controllers/getCount";
import getDateHistogramController from "../controllers/analytics-controllers/getDateHistogram";
import validationMiddleware from "../middlewares/validationMiddleware";

const analyticsRouter = Router();

analyticsRouter.get(
  "/count/:entity",
  getCountController.validator,
  validationMiddleware,
  getCountController.controller,
);
analyticsRouter.get(
  "/date-histogram/:entity",
  getDateHistogramController.validator,
  validationMiddleware,
  getDateHistogramController.controller,
);

export default analyticsRouter;
