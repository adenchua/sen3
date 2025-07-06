import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { Message } from "../../interfaces/MessageInterface";
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

const validationChains: ValidationChain[] = [
  body("messages").isArray({ min: 1 }).exists(),
  body("messages.*.createdDate").isISO8601().exists(),
  body("messages.*.chatUsername").isString().exists(),
  body("messages.*.editedDate").isISO8601().optional({ values: "null" }),
  body("messages.*.forwardCount").isInt().optional({ values: "null" }),
  body("messages.*.messageId").isString().exists(),
  body("messages.*.text").isString().exists(),
  body("messages.*.viewCount").isInt().optional({ values: "null" }),
];

async function createMessages(request: Request, response: Response): Promise<void> {
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

const createMessagesController: ControllerInterface = {
  controller: createMessages,
  validator: validationChains,
};

export default createMessagesController;
