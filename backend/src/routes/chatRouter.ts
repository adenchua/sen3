import { Router } from "express";

import createChat, { createChatValidationChains } from "../controllers/chat-controllers/createChat";
import validationMiddleware from "../middlewares/validationMiddleware";
import getChats, { getChatsValidationChains } from "../controllers/chat-controllers/getChats";
import updateChat, { updateChatValidationChains } from "../controllers/chat-controllers/updateChat";

const chatRouter = Router();

chatRouter.post("/", createChatValidationChains, validationMiddleware, createChat);
chatRouter.get("/", getChatsValidationChains, validationMiddleware, getChats);
chatRouter.patch("/:chatId", updateChatValidationChains, validationMiddleware, updateChat);

export default chatRouter;
