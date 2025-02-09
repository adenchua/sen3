import { Request, Response } from "express";
import { body, check, ValidationChain } from "express-validator";

import { invalidTelegramChatIdError } from "../../errors/invalidTelegramChatError";
import { ParticipantStat } from "../../interfaces/ChatInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  id: string;
  participantStat?: { count: number; date: string };
  crawlActive?: boolean;
  messageOffsetId?: number;
  lastCrawlDate?: string;
  recommendedChannels?: string[];
}

export const updateChatValidationChains: ValidationChain[] = [
  body("participantStat").isObject().optional(),
  check("participantStat.count").isInt({ min: 0 }).optional(),
  check("participantStat.date").isISO8601().optional(),
  body("crawlActive").isBoolean().optional(),
  body("messageOffsetId").isInt({ min: 0 }).optional(),
  body("lastCrawlDate").isISO8601().optional(),
  body("recommendedChannels").isArray().optional(),
  body("recommendedChannels.*").isString().trim(),
];

export default async function updateChat(request: Request, response: Response): Promise<void> {
  const { chatId } = request.params;
  const { participantStat, crawlActive, messageOffsetId, lastCrawlDate, recommendedChannels } =
    request.body as RequestBody;

  const chatModel = new ChatModel(databaseInstance);

  const chat = await chatModel.fetchOne(chatId);

  if (chat == null) {
    throw invalidTelegramChatIdError;
  }

  const chatParticipantStats = chat.participantStats;

  if (participantStat != undefined) {
    const countDate = new Date(participantStat.date);
    const temp: ParticipantStat = { count: participantStat.count, date: countDate };
    chatParticipantStats.push(temp);
  }

  await chatModel.update(chatId, {
    participantStats: chatParticipantStats,
    crawlActive,
    messageOffsetId,
    lastCrawlDate: lastCrawlDate == undefined ? undefined : new Date(lastCrawlDate),
    recommendedChannels,
    updatedDate: new Date(),
  });

  response.sendStatus(204);
}
