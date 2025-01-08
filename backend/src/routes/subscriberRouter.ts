import { Router } from "express";

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

export default subscriberRouter;
