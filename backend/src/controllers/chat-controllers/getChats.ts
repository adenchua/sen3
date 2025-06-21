import { Request, Response } from "express";
import { ValidationChain, query } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import transformQueryParam from "../utils/queryParamTransformer";

interface RequestQuery {
  from?: string;
  size?: string;
  crawlActive?: string;
}

const validationChains: ValidationChain[] = [
  query("crawlActive").isIn([0, 1]).optional(),
  query("from").isInt({ min: 0, max: 10_000 }).optional(),
  query("size").isInt({ min: 0, max: 10_000 }).optional(),
];

async function getChats(request: Request, response: Response): Promise<void> {
  const { from, size, crawlActive } = request.query as RequestQuery;

  const _from = transformQueryParam<number>(from, Number);
  const _size = transformQueryParam<number>(size, Number);
  const _crawlActive = transformQueryParam<boolean>(crawlActive, Boolean);

  const chatModel = new ChatModel(databaseInstance);
  const result = await chatModel.fetch({ crawlActive: _crawlActive }, _from, _size);

  response.status(200).send(wrapResponse(result));
}

const getChatsController: ControllerInterface = {
  controller: getChats,
  validator: validationChains,
};

export default getChatsController;
