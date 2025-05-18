import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import InvalidDeckError from "../../errors/decks/InvalidDeckError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  chatIds: string[];
  isActive: boolean;
  keywords: string[];
  title: string;
  lastNotificationDate: string;
}

const validationChains: ValidationChain[] = [
  body("chatIds").isArray().optional(),
  body("chatIds.*").isString(),
  body("isActive").isBoolean().optional(),
  body("keywords").isArray().optional(),
  body("keywords.*").isString(),
  body("title").isString().trim().optional(),
  body("lastNotificationDate").isISO8601().optional(),
];

async function updateDeck(request: Request, response: Response): Promise<void> {
  const { chatIds, isActive, keywords, title, lastNotificationDate } = request.body as RequestBody;
  const { id } = request.params;

  const _lastNotificationDate = lastNotificationDate ? new Date(lastNotificationDate) : undefined;

  const deckModel = new DeckModel(databaseInstance);
  const deck = await deckModel.fetchOne(id);

  if (deck == null) {
    throw new InvalidDeckError(id);
  }

  await deckModel.update(id, {
    chatIds,
    isActive,
    keywords,
    title,
    lastNotificationDate: _lastNotificationDate,
  });

  response.sendStatus(204);
}

const updateDeckController: ControllerInterface = {
  controller: updateDeck,
  validator: validationChains,
};

export default updateDeckController;
