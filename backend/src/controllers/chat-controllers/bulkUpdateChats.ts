import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";

interface ChatUpdate {
  id: string;
  messageOffsetId?: number | null;
  lastCrawlDate?: string;
}

interface RequestBody {
  chats: ChatUpdate[];
}

const validationChains: ValidationChain[] = [
  body("chats").isArray({ min: 1 }),
  body("chats.*.id").isString().notEmpty(),
  body("chats.*.messageOffsetId").isInt({ min: 0 }).optional({ values: "null" }),
  body("chats.*.lastCrawlDate").isISO8601().optional(),
];

async function bulkUpdateChats(request: Request, response: Response): Promise<void> {
  const { chats } = request.body as RequestBody;

  const chatModel = new ChatModel(databaseInstance);

  const updates = chats.map((chat) => ({
    id: chat.id,
    messageOffsetId: chat.messageOffsetId,
    lastCrawlDate: chat.lastCrawlDate == undefined ? undefined : new Date(chat.lastCrawlDate),
  }));

  await chatModel.updateMany(updates);

  response.sendStatus(204);
}

const bulkUpdateChatsController: ControllerInterface = {
  controller: bulkUpdateChats,
  validator: validationChains,
};

export default bulkUpdateChatsController;
