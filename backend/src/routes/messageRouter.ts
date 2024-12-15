import { Router } from "express";

import createMessage, {
  createMessageValidationChains,
} from "../controllers/message-controllers/createMessage";
import createMessages, {
  createMessagesValidationChains,
} from "../controllers/message-controllers/createMessages";
import validationMiddleware from "../middlewares/validationMiddleware";

const messageRouter = Router();

messageRouter.post("/", createMessageValidationChains, validationMiddleware, createMessage);
messageRouter.post("/bulk", createMessagesValidationChains, validationMiddleware, createMessages);

export default messageRouter;