import { Router } from "express";

import getCount, { getCountValidationChain } from "../controllers/analytics-controllers/getCount";
import getDateHistogram, {
  getDateHistogramValidationChain,
} from "../controllers/analytics-controllers/getDateHistogram";
import validationMiddleware from "../middlewares/validationMiddleware";

const analyticsRouter = Router();

analyticsRouter.get("/count/:entity", getCountValidationChain, validationMiddleware, getCount);
analyticsRouter.get(
  "/date-histogram/:entity",
  getDateHistogramValidationChain,
  validationMiddleware,
  getDateHistogram,
);

export default analyticsRouter;
