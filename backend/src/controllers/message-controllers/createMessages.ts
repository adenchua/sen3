import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import Message from "../../interfaces/MessageInterface";
import { MessageModel } from "../../models/MessageModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  messages: Array<{
    chatId: string;
    createdDate: string;
    chatUsername: string;
    editedDate: string;
    forwardCount: number;
    messageId: string;
    text: string;
    viewCount: number;
  }>;
}

export const createMessagesValidationChains: ValidationChain[] = [
  body("messages").isArray({ min: 1 }).notEmpty(),
  body("messages.*.createdDate").isISO8601().notEmpty(),
  body("messages.*.chatUsername").isString().notEmpty(),
  body("messages.*.editedDate").isISO8601().optional(),
  body("messages.*.forwardCount").isNumeric().notEmpty(),
  body("messages.*.messageId").isString().notEmpty(),
  body("messages.*.text").isString().notEmpty(),
  body("messages.*.viewCount").isNumeric().notEmpty(),
];

export default async function createMessages(request: Request, response: Response): Promise<void> {
  const { messages } = request.body as RequestBody;

  const newMessages: Message[] = messages.map((message) => {
    const {
      chatId,
      chatUsername,
      createdDate,
      editedDate,
      forwardCount,
      messageId,
      text,
      viewCount,
    } = message;
    return {
      id: `${chatId}_${messageId}`,
      chatId,
      createdDate: new Date(createdDate),
      chatUsername,
      editedDate: editedDate == undefined ? null : new Date(editedDate),
      forwardCount,
      messageId,
      text,
      updatedDate: new Date(),
      viewCount,
    };
  });

  const messageModel = new MessageModel(databaseInstance);
  await messageModel.saveMany(newMessages);

  response.status(201).send();
}
