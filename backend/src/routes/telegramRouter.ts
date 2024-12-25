import { Router } from "express";

import getChat from "../controllers/telegram-controllers/getChat";
import getChatMessages, {
  getChatMessagesValidationChains,
} from "../controllers/telegram-controllers/getChatMessages";
import validationMiddleware from "../middlewares/validationMiddleware";

const telegramRouter = Router();

telegramRouter.get("/chats/:chatUsername", getChat);
telegramRouter.get(
  "/chats/:chatUsername/messages",
  getChatMessagesValidationChains,
  validationMiddleware,
  getChatMessages,
);

export default telegramRouter;
