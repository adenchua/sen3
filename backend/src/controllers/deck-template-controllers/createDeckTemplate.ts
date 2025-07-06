import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckTemplate } from "../../interfaces/DeckTemplateInterface";
import { DeckTemplateModel } from "../../models/DeckTemplateModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

interface RequestBody {
  chatIds: string[];
  isDefault?: boolean;
  title: string;
}

const validationChains: ValidationChain[] = [
  body("chatIds").isArray().exists(),
  body("chatIds.*").isString(),
  body("isDefault").isBoolean().optional(),
  body("title").isString().trim().notEmpty(),
];

async function createDeckTemplate(request: Request, response: Response): Promise<void> {
  const { chatIds, isDefault, title } = request.body as RequestBody;

  const newDeckTemplate: Omit<DeckTemplate, "id" | "createdDate" | "updatedDate"> = {
    chatIds,
    isDefault: isDefault === undefined ? false : isDefault,
    isDeleted: false,
    title,
  };

  const deckTemplateModel = new DeckTemplateModel(databaseInstance);
  const documentId = await deckTemplateModel.save(newDeckTemplate);

  response.status(201).send(wrapResponse(documentId));
}

const createDeckTemplateController: ControllerInterface = {
  controller: createDeckTemplate,
  validator: validationChains,
};

export default createDeckTemplateController;
