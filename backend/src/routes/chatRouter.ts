import { Router } from "express";

import createChat from "../controllers/chat-controllers/createChat";

const router = Router();

router.post("/", createChat);

export default router;
