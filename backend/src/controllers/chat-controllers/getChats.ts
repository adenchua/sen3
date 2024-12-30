import { Request, Response } from "express";
import { ValidationChain, query } from "express-validator";

import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import transformQueryParam from "../utils/queryParamTransformer";

interface RequestQuery {
  from: string;
  size: string;
  crawlActive: string;
}

export const getChatsValidationChains: ValidationChain[] = [
  query("crawlActive").isIn([0, 1]).optional(),
  query("from").isInt({ min: 0, max: 10_000 }).optional(),
  query("size").isInt({ min: 0, max: 10_000 }).optional(),
];

export default async function getChats(request: Request, response: Response): Promise<void> {
  const { from, size, crawlActive } = request.query as unknown as RequestQuery;

  const _from = transformQueryParam<number>(from, Number);
  const _size = transformQueryParam<number>(size, Number);
  const _crawlActive = transformQueryParam<boolean>(+crawlActive, Boolean);

  const chatModel = new ChatModel(databaseInstance);
  const result = await chatModel.fetch({ crawlActive: _crawlActive }, _from, _size);

  response.status(200).send(wrapResponse(result));
}
