import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import InvalidDeckError from "../../errors/decks/InvalidDeckError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckTemplateModel } from "../../models/DeckTemplateModel";
import { databaseInstance } from "../../singletons";
import { DeckModel } from "../../models/DeckModel";

interface RequestBody {
  chatIds: string[];
  isDefault: boolean;
  isDeleted: boolean;
  title: string;
}

const validationChains: ValidationChain[] = [
  body("chatIds").isArray().optional(),
  body("chatIds.*").isString(),
  body("isDefault").isBoolean().optional(),
  body("isDeleted").isBoolean().optional(),
  body("title").isString().trim().optional(),
];

async function updateDeckTemplate(request: Request, response: Response): Promise<void> {
  const { chatIds, isDefault, isDeleted, title } = request.body as RequestBody;
  const { id } = request.params;

  const deckTemplateModel = new DeckTemplateModel(databaseInstance);
  const deckModel = new DeckModel(databaseInstance);
  const deckTemplate = await deckTemplateModel.fetchOne(id);

  if (deckTemplate == null) {
    throw new InvalidDeckError(id);
  }

  await deckTemplateModel.update(id, {
    chatIds,
    isDefault,
    isDeleted,
    title,
  });

  // update chat IDs for all decks that inherited from this template
  if (chatIds && chatIds.length > 0) {
    await deckModel.syncDecksWithTemplate(id, { chatIds });
  }

  response.sendStatus(204);
}

const updateDeckTemplateController: ControllerInterface = {
  controller: updateDeckTemplate,
  validator: validationChains,
};

export default updateDeckTemplateController;
