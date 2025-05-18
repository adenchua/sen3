import { Request, Response } from "express";

import InvalidDeckError from "../../errors/decks/InvalidDeckError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

async function getDeckById(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  const deckModel = new DeckModel(databaseInstance);
  const result = await deckModel.fetchOne(id);

  if (result == null) {
    throw new InvalidDeckError(id);
  }

  response.status(200).send(wrapResponse(result));
}

const getDeckByIdController: ControllerInterface = {
  controller: getDeckById,
  validator: [],
};

export default getDeckByIdController;
