import { Router } from "express";

import createMessageController from "../controllers/message-controllers/createMessage";
import createMessagesController from "../controllers/message-controllers/createMessages";
import getMessagesController from "../controllers/message-controllers/getMessages";
import validationMiddleware from "../middlewares/validationMiddleware";

const messageRouter = Router();

messageRouter.get(
  "/",
  getMessagesController.validator,
  validationMiddleware,
  getMessagesController.controller,
);
messageRouter.post(
  "/",
  createMessageController.validator,
  validationMiddleware,
  createMessageController.controller,
);
messageRouter.post(
  "/bulk",
  createMessagesController.validator,
  validationMiddleware,
  createMessagesController.controller,
);

export default messageRouter;
