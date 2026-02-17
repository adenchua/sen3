import { Request, Response } from "express";

import InvalidDeckTemplateError from "../../errors/deck-templates/InvalidDeckTemplateError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckTemplateModel } from "../../models/DeckTemplateModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

async function getDeckTemplateById(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  const deckTemplateModel = new DeckTemplateModel(databaseInstance);
  const result = await deckTemplateModel.fetchOne(id as string);

  if (result == null) {
    throw new InvalidDeckTemplateError(id as string);
  }

  response.status(200).send(wrapResponse(result));
}

const getDeckTemplateByIdController: ControllerInterface = {
  controller: getDeckTemplateById,
  validator: [],
};

export default getDeckTemplateByIdController;
