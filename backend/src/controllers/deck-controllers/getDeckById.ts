import { Request, Response } from "express";

import { invalidDeckError } from "../../errors/deckError";
import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

export default async function getDeckById(request: Request, response: Response): Promise<void> {
  const { deckId } = request.params;

  const deckModel = new DeckModel(databaseInstance);
  const result = await deckModel.fetchOne(deckId);

  if (result == null) {
    throw invalidDeckError;
  }

  response.status(200).send(wrapResponse(result));
}
