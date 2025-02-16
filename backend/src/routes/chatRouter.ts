import { Router } from "express";

import createChat, { createChatValidationChains } from "../controllers/chat-controllers/createChat";
import getChatById from "../controllers/chat-controllers/getChatById";
import getChats, { getChatsValidationChains } from "../controllers/chat-controllers/getChats";
import updateChat, { updateChatValidationChains } from "../controllers/chat-controllers/updateChat";
import validationMiddleware from "../middlewares/validationMiddleware";

const chatRouter = Router();

chatRouter.post("/", createChatValidationChains, validationMiddleware, createChat);
chatRouter.get("/:id", getChatById);
chatRouter.get("/", getChatsValidationChains, validationMiddleware, getChats);
chatRouter.patch("/:id", updateChatValidationChains, validationMiddleware, updateChat);

export default chatRouter;
