import { Request, Response } from "express";
import { query, ValidationChain } from "express-validator";

import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import InvalidChatError from "../../errors/chats/InvalidChatError";
import ControllerInterface from "../../interfaces/ControllerInterface";

const validationChains: ValidationChain[] = [
  query("limit").isInt({ min: 1, max: 1000 }).optional(),
  query("latest").isIn([0, 1]).optional(),
  query("offsetId").isNumeric().optional(),
];

async function getChatMessages(request: Request, response: Response): Promise<void> {
  const { chatUsername } = request.params;
  const { limit, latest, offsetId } = request.query;

  let tempLimit = 10;
  const tempLatest = !!latest;
  let tempOffsetId = 0;

  // if number query is provided, send as parameter
  if (limit != null) {
    tempLimit = Number(limit);
  }

  if (offsetId != null) {
    tempOffsetId = Number(offsetId);
  }

  const chat = await telegramInstance.fetchTelegramChat(chatUsername);

  // chat does not exist, throw error
  if (chat == null) {
    throw new InvalidChatError(chatUsername);
  }

  const messages = await telegramInstance.fetchTelegramChatMessages(
    chatUsername,
    tempLimit,
    tempLatest,
    tempOffsetId,
  );

  response.status(200).send(wrapResponse(messages));
}

const getChatMessagesController: ControllerInterface = {
  controller: getChatMessages,
  validator: validationChains,
};

export default getChatMessagesController;
