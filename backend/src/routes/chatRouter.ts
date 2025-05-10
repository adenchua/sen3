import { Router } from "express";

import createChatController from "../controllers/chat-controllers/createChat";
import getChatByIdController from "../controllers/chat-controllers/getChatById";
import getChatsController from "../controllers/chat-controllers/getChats";
import getChatsByIdsController from "../controllers/chat-controllers/getChatsByIds";
import updateChatController from "../controllers/chat-controllers/updateChat";
import validationMiddleware from "../middlewares/validationMiddleware";

const chatRouter = Router();

chatRouter.get(
  "/",
  getChatsController.validator,
  validationMiddleware,
  getChatsController.controller,
);
chatRouter.post(
  "/",
  createChatController.validator,
  validationMiddleware,
  createChatController.controller,
);

chatRouter.get("/:id", getChatByIdController.controller);
chatRouter.patch(
  "/:id",
  updateChatController.validator,
  validationMiddleware,
  updateChatController.controller,
);

chatRouter.post(
  "/ids",
  getChatsByIdsController.validator,
  validationMiddleware,
  getChatsByIdsController.controller,
);

export default chatRouter;
