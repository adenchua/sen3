import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import { invalidDeckError } from "../../errors/deckError";
import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  chatIds: string[];
  isActive: boolean;
  keywords: string[];
  title: string;
}

export const updateDeckValidationChains: ValidationChain[] = [
  body("chatIds").isArray().optional(),
  body("chatIds.*").isString(),
  body("isActive").isBoolean().optional(),
  body("keywords").isArray().optional(),
  body("keywords.*").isString(),
  body("title").isString().trim().optional(),
];

export default async function updateDeck(request: Request, response: Response): Promise<void> {
  const { chatIds, isActive, keywords, title } = request.body as RequestBody;
  const { deckId } = request.params;

  const deckModel = new DeckModel(databaseInstance);
  const deck = await deckModel.fetchOne(deckId);

  if (deck == null) {
    throw invalidDeckError;
  }

  await deckModel.update(deckId, { chatIds, isActive, keywords, title });

  response.sendStatus(204);
}
