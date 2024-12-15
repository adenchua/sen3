import { Router } from "express";

import createChat, { createChatValidationChains } from "../controllers/chat-controllers/createChat";
import validationMiddleware from "../middlewares/validationMiddleware";

const chatRouter = Router();

chatRouter.post("/", createChatValidationChains, validationMiddleware, createChat);

export default chatRouter;
