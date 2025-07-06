import { Request, Response } from "express";
import { body, check, ValidationChain } from "express-validator";

import InvalidChatError from "../../errors/chats/InvalidChatError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  id: string;
  participantStat?: { count: number; date: string };
  crawlActive?: boolean;
  messageOffsetId?: number | null;
  lastCrawlDate?: string;
  recommendedChannels?: string[];
}

const validationChains: ValidationChain[] = [
  body("participantStat").isObject().optional(),
  check("participantStat.count").isInt({ min: 0 }).optional(),
  check("participantStat.date").isISO8601().optional(),
  body("crawlActive").isBoolean().optional(),
  body("messageOffsetId").isInt({ min: 0 }).optional({ values: "null" }),
  body("lastCrawlDate").isISO8601().optional(),
  body("recommendedChannels").isArray().optional(),
  body("recommendedChannels.*").isString().trim(),
];

async function updateChat(request: Request, response: Response): Promise<void> {
  const { id } = request.params;
  const { participantStat, crawlActive, messageOffsetId, lastCrawlDate, recommendedChannels } =
    request.body as RequestBody;

  const chatModel = new ChatModel(databaseInstance);

  const chat = await chatModel.fetchOne(id);

  if (chat == null) {
    throw new InvalidChatError(id);
  }

  const chatParticipantStats = chat.participantStats;

  if (participantStat != undefined) {
    const countDate = new Date(participantStat.date);
    chatParticipantStats.push({ count: participantStat.count, date: countDate });
  }

  await chatModel.update(id, {
    participantStats: chatParticipantStats,
    crawlActive,
    messageOffsetId,
    lastCrawlDate: lastCrawlDate == undefined ? undefined : new Date(lastCrawlDate),
    recommendedChannels,
  });

  response.sendStatus(204);
}

const getChatsByIdsController: ControllerInterface = {
  controller: updateChat,
  validator: validationChains,
};

export default getChatsByIdsController;
