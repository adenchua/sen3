import { Request, Response } from "express";
import { ValidationChain, query } from "express-validator";

import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import transformQueryParam from "../utils/queryParamTransformer";

interface RequestQuery {
  from: string;
  size: string;
}

export const getDecksBySubscriberIdValidationChains: ValidationChain[] = [
  query("from").isInt({ min: 0, max: 10_000 }).optional(),
  query("size").isInt({ min: 0, max: 10_000 }).optional(),
];

export default async function getDecksBySubscriberId(
  request: Request,
  response: Response,
): Promise<void> {
  const { from, size } = request.query as unknown as RequestQuery;
  const { id } = request.params;

  const _from = transformQueryParam<number>(from, Number);
  const _size = transformQueryParam<number>(size, Number);

  const deckModel = new DeckModel(databaseInstance);
  const result = await deckModel.fetch({ subscriberId: id }, _from, _size);

  response.status(200).send(wrapResponse(result));
}
