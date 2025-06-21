import { Request, Response } from "express";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckModel } from "../../models/DeckModel";
import { databaseInstance } from "../../singletons";

async function deleteDeck(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  const deckModel = new DeckModel(databaseInstance);
  await deckModel.delete(id);

  response.status(204).send();
}

const deleteDeckController: ControllerInterface = {
  controller: deleteDeck,
  validator: [],
};

export default deleteDeckController;
