import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import Chat from "../../interfaces/ChatInterface";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

interface RequestBody {
  id: string;
  about: string;
  createdDate: string;
  isChannel: boolean;
  isVerified: boolean;
  participantCount: number;
  title: string;
  username: string;
}

export const validationChains: ValidationChain[] = [
  body("id").isString().trim().notEmpty(),
  body("about").isString().trim().optional(),
  body("createdDate").trim().isISO8601().exists(),
  body("isChannel").isBoolean().exists(),
  body("isVerified").isBoolean().exists(),
  body("participantCount").isNumeric().exists(),
  body("title").isString().trim().notEmpty(),
  body("username").isString().trim().notEmpty(),
];

async function createChat(request: Request, response: Response): Promise<void> {
  const { id, about, createdDate, isChannel, isVerified, participantCount, title, username } =
    request.body as RequestBody;

  const newChat: Chat = {
    id,
    about,
    createdDate: new Date(createdDate),
    isChannel,
    isVerified,
    participantStats: [
      {
        count: participantCount,
        date: new Date(),
      },
    ],
    title,
    username,
    crawlActive: false,
    lastCrawlDate: null,
    messageOffsetId: null,
    recommendedChannels: [],
    updatedDate: new Date(),
  };

  const chatModel = new ChatModel(databaseInstance);
  const chatId = await chatModel.save(newChat);

  response.status(201).send(wrapResponse(chatId));
}

const createChatController: ControllerInterface = {
  controller: createChat,
  validator: validationChains,
};

export default createChatController;
