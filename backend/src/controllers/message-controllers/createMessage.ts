import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import Message from "../../interfaces/MessageInterface";
import { MessageModel } from "../../models/MessageModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  chatId: string;
  createdDate: string;
  chatUsername: string;
  editedDate?: string;
  forwardCount: number;
  messageId: string;
  text: string;
  viewCount: number;
}

export const createMessageValidationChains: ValidationChain[] = [
  body("chatId").isString().notEmpty(),
  body("createdDate").isISO8601().notEmpty(),
  body("chatUsername").isString().notEmpty(),
  body("editedDate").isISO8601().optional(),
  body("forwardCount").isNumeric().notEmpty(),
  body("messageId").isString().notEmpty(),
  body("text").isString().notEmpty(),
  body("viewCount").isNumeric().notEmpty(),
];

export default async function createMessage(request: Request, response: Response): Promise<void> {
  const {
    chatId,
    createdDate,
    chatUsername,
    editedDate,
    forwardCount,
    messageId,
    text,
    viewCount,
  } = request.body as RequestBody;

  const newMessage: Message = {
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

  const messageModel = new MessageModel(databaseInstance, newMessage);
  await messageModel.save();

  response.status(201).send();
}