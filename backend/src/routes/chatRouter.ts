import { Router } from "express";

import createChat, { createChatValidationChains } from "../controllers/chat-controllers/createChat";
import validationMiddleware from "../middlewares/validationMiddleware";
import getChats, { getChatsValidationChains } from "../controllers/chat-controllers/getChats";

const chatRouter = Router();

chatRouter.post("/", createChatValidationChains, validationMiddleware, createChat);
chatRouter.get("/", getChatsValidationChains, validationMiddleware, getChats);

export default chatRouter;
