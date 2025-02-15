import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import Deck from "../../interfaces/DeckInterface";
import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

interface RequestBody {
  chatIds: string[];
  isActive: boolean;
  keywords: string[];
  title: string;
}

export const createDeckValidationChains: ValidationChain[] = [
  body("chatIds").isArray().exists(),
  body("chatIds.*").isString(),
  body("isActive").isBoolean().exists(),
  body("keywords").isArray().exists(),
  body("keywords.*").isString(),
  body("title").isString().trim().notEmpty(),
];

export default async function createDeck(request: Request, response: Response): Promise<void> {
  const { chatIds, isActive, keywords, title } = request.body as RequestBody;
  const { id } = request.params;

  const newDeck: Deck = {
    title,
    chatIds,
    createdDate: new Date(),
    isActive,
    keywords,
    lastNotificationDate: new Date(),
    subscriberId: id,
  };

  // TODO: add validation for subscriber ID

  const deckModel = new DeckModel(databaseInstance);
  const documentId = await deckModel.save(newDeck);

  response.status(201).send(wrapResponse(documentId));
}
