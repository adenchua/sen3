import { Request, Response } from "express";
import { query, ValidationChain } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckTemplateModel } from "../../models/DeckTemplateModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import transformQueryParam from "../utils/queryParamTransformer";

interface QueryParams {
  size?: string;
  from?: string;
  isDefault?: string;
}

const validationChains: ValidationChain[] = [
  query("from").isString().isInt({ min: 0, max: 10_000 }).optional(),
  query("size").isString().isInt({ min: 0, max: 10_000 }).optional(),
  query("isDefault").isString().isBoolean().optional(),
];

async function getDeckTemplates(request: Request, response: Response): Promise<void> {
  const { size, from, isDefault } = request.query as QueryParams;

  const _from = transformQueryParam<number>(from, Number);
  const _size = transformQueryParam<number>(size, Number);
  const _isDefault = transformQueryParam<boolean>(isDefault, Boolean);

  const deckTemplateModel = new DeckTemplateModel(databaseInstance);
  const documents = await deckTemplateModel.fetch({ isDefault: _isDefault }, _from, _size);

  response.status(200).send(wrapResponse(documents));
}

const getDeckTemplatesController: ControllerInterface = {
  controller: getDeckTemplates,
  validator: validationChains,
};

export default getDeckTemplatesController;
