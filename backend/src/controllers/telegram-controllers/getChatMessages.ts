import { Request, Response } from "express";
import { query, ValidationChain } from "express-validator";

import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

export const getChatMessagesValidationChains: ValidationChain[] = [
  query("limit").isInt({ min: 1, max: 1000 }),
];

export default async function getChatMessages(request: Request, response: Response): Promise<void> {
  const { chatUsername } = request.params;
  const { limit = 10 } = request.query;

  let tempLimit = 10;

  // if number query is provided, send as parameter
  if (limit) {
    tempLimit = Number(limit);
  }

  const messages = await telegramInstance.fetchChatMessages(chatUsername, tempLimit);

  response.status(200).send(wrapResponse(messages));
}
