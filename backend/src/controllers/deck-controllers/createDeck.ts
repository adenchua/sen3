import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import InvalidSubscriberError from "../../errors/subscribers/InvalidSubscriberError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import Deck from "../../interfaces/DeckInterface";
import { DeckModel } from "../../models/DeckModel";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

interface RequestBody {
  subscriberId: string;
  chatIds: string[];
  isActive: boolean;
  keywords: string[];
  title: string;
}

const validationChains: ValidationChain[] = [
  body("subscriberId").isString().notEmpty(),
  body("chatIds").isArray().exists(),
  body("chatIds.*").isString(),
  body("isActive").isBoolean().exists(),
  body("keywords").isArray().exists(),
  body("keywords.*").isString(),
  body("title").isString().trim().notEmpty(),
];

async function createDeck(request: Request, response: Response): Promise<void> {
  const { subscriberId, chatIds, isActive, keywords, title } = request.body as RequestBody;

  const subscriberModel = new SubscriberModel(databaseInstance);
  const subscriber = await subscriberModel.fetchOne(subscriberId);

  if (subscriber == null) {
    throw new InvalidSubscriberError(subscriberId);
  }

  const newDeck: Omit<Deck, "id" | "updatedDate" | "createdDate"> = {
    title,
    chatIds,
    isActive,
    keywords,
    lastNotificationDate: new Date(),
    subscriberId: subscriberId,
  };

  const deckModel = new DeckModel(databaseInstance);
  const documentId = await deckModel.save(newDeck);

  response.status(201).send(wrapResponse(documentId));
}

const createDeckController: ControllerInterface = {
  controller: createDeck,
  validator: validationChains,
};

export default createDeckController;
