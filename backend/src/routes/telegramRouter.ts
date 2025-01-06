import { Router } from "express";

import getChat from "../controllers/telegram-controllers/getChat";
import getChatMessages, {
  getChatMessagesValidationChains,
} from "../controllers/telegram-controllers/getChatMessages";
import validationMiddleware from "../middlewares/validationMiddleware";
import getChannelRecommendations from "../controllers/telegram-controllers/getChatRecommendations";

const telegramRouter = Router();

telegramRouter.get("/chats/:chatUsername", getChat);
telegramRouter.get(
  "/chats/:chatUsername/messages",
  getChatMessagesValidationChains,
  validationMiddleware,
  getChatMessages,
);

telegramRouter.get("/chats/:chatUsername/recommendations", getChannelRecommendations);

export default telegramRouter;
