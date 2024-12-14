import { Request, Response } from "express";

import Chat from "../../interfaces/ChatInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";

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

export default async function createChat(request: Request, response: Response): Promise<void> {
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

  const chatModel = new ChatModel(databaseInstance, newChat);
  await chatModel.save();

  response.status(201).send();
}
