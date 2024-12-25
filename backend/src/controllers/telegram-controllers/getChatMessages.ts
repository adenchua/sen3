import { Request, Response } from "express";
import { query, ValidationChain } from "express-validator";

import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

export const getChatMessagesValidationChains: ValidationChain[] = [
  query("limit").isInt({ min: 1, max: 1000 }).optional(),
  query("latest").isIn([0, 1]).optional(),
  query("offsetId").isNumeric().optional(),
];

export default async function getChatMessages(request: Request, response: Response): Promise<void> {
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

  const messages = await telegramInstance.fetchChatMessages(
    chatUsername,
    tempLimit,
    tempLatest,
    tempOffsetId,
  );

  response.status(200).send(wrapResponse(messages));
}
