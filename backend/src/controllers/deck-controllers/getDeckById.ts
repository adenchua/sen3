import { Request, Response } from "express";

import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import InvalidDeckError from "../../errors/decks/InvalidDeckError";

export default async function getDeckById(request: Request, response: Response): Promise<void> {
  const { deckId } = request.params;

  const deckModel = new DeckModel(databaseInstance);
  const result = await deckModel.fetchOne(deckId);

  if (result == null) {
    throw new InvalidDeckError(deckId);
  }

  response.status(200).send(wrapResponse(result));
}
