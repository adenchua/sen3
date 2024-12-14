import { Router } from "express";

import createChat, { createChatValidationChains } from "../controllers/chat-controllers/createChat";
import validationMiddleware from "../middlewares/validationMiddleware";

const router = Router();

router.post("/", createChatValidationChains, validationMiddleware, createChat);

export default router;
