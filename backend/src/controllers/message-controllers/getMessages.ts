import { Request, Response } from "express";
import { ValidationChain, query } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { MessageModel } from "../../models/MessageModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import transformQueryParam from "../utils/queryParamTransformer";

interface RequestQuery {
  from: string;
  size: string;
  keywords: string;
  chatIds: string;
  createdDateFrom: string;
}

const validationChains: ValidationChain[] = [
  query("from").isInt({ min: 0, max: 10_000 }).optional(),
  query("size").isInt({ min: 0, max: 10_000 }).optional(),
  query("keywords").optional(),
  query("chatIds").optional(),
  query("createdDateFrom").isISO8601().optional(),
];

async function getMessages(request: Request, response: Response): Promise<void> {
  const { from, size, keywords, chatIds, createdDateFrom } =
    request.query as unknown as RequestQuery;

  const _from = transformQueryParam<number>(from, Number);
  const _size = transformQueryParam<number>(size, Number);
  const _keywords = transformQueryParam<string[]>(keywords, Array);
  const _chatIds = transformQueryParam<string[]>(chatIds, Array);

  const messageModel = new MessageModel(databaseInstance);
  const result = await messageModel.fetch(
    { keywords: _keywords, chatIds: _chatIds, createdDateFrom },
    _from,
    _size,
  );

  response.status(200).send(wrapResponse(result));
}

const getMessagesController: ControllerInterface = {
  controller: getMessages,
  validator: validationChains,
};

export default getMessagesController;
