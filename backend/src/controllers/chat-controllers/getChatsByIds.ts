import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

const validationChains: ValidationChain[] = [
  body("ids").isArray({ min: 0, max: 10_000 }).exists(),
  body("ids.*").isString(),
];

async function getChatsByIds(request: Request, response: Response): Promise<void> {
  const { ids } = request.body;

  const chatModel = new ChatModel(databaseInstance);
  const result = await chatModel.fetch({ ids }, 0, 10_000);

  response.status(200).send(wrapResponse(result));
}

const getChatsByIdsController: ControllerInterface = {
  controller: getChatsByIds,
  validator: validationChains,
};

export default getChatsByIdsController;
