import { Router } from "express";

import getChat from "../controllers/telegram-controllers/getChat";

const telegramRouter = Router();

telegramRouter.get("/chats/:chatUsername", getChat);

export default telegramRouter;
