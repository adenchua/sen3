import { Router } from "express";

import getChatController from "../controllers/telegram-controllers/getChat";
import getChatMessagesController from "../controllers/telegram-controllers/getChatMessages";
import validationMiddleware from "../middlewares/validationMiddleware";
import getChannelRecommendationsController from "../controllers/telegram-controllers/getChatRecommendations";

const telegramRouter = Router();

telegramRouter.get("/chats/:chatUsername", getChatController.controller);
telegramRouter.get(
  "/chats/:chatUsername/messages",
  getChatMessagesController.validator,
  validationMiddleware,
  getChatMessagesController.controller,
);

telegramRouter.get(
  "/chats/:chatUsername/recommendations",
  getChannelRecommendationsController.controller,
);

export default telegramRouter;
