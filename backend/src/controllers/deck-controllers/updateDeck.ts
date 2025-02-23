import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";
import InvalidDeckError from "../../errors/decks/InvalidDeckError";

interface RequestBody {
  chatIds: string[];
  isActive: boolean;
  keywords: string[];
  title: string;
  lastNotificationDate: string;
}

export const updateDeckValidationChains: ValidationChain[] = [
  body("chatIds").isArray().optional(),
  body("chatIds.*").isString(),
  body("isActive").isBoolean().optional(),
  body("keywords").isArray().optional(),
  body("keywords.*").isString(),
  body("title").isString().trim().optional(),
  body("lastNotificationDate").isISO8601().optional(),
];

export default async function updateDeck(request: Request, response: Response): Promise<void> {
  const { chatIds, isActive, keywords, title, lastNotificationDate } = request.body as RequestBody;
  const { deckId } = request.params;

  const _lastNotificationDate = lastNotificationDate ? new Date(lastNotificationDate) : undefined;

  const deckModel = new DeckModel(databaseInstance);
  const deck = await deckModel.fetchOne(deckId);

  if (deck == null) {
    throw new InvalidDeckError(deckId);
  }

  await deckModel.update(deckId, {
    chatIds,
    isActive,
    keywords,
    title,
    lastNotificationDate: _lastNotificationDate,
  });

  response.sendStatus(204);
}
