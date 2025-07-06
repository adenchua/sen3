import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import InvalidSubscriberError from "../../errors/subscribers/InvalidSubscriberError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { DeckModel } from "../../models/DeckModel";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import { Deck } from "../../interfaces/DeckInterface";

interface RequestBody {
  chatIds: string[];
  deckTemplateId?: string;
  isActive: boolean;
  keywords: string[];
  subscriberId: string;
  title: string;
}

const validationChains: ValidationChain[] = [
  body("chatIds.*").isString(),
  body("chatIds").isArray().exists(),
  body("deckTemplateId").isString().notEmpty().optional(),
  body("isActive").isBoolean().exists(),
  body("keywords.*").isString(),
  body("keywords").isArray().exists(),
  body("subscriberId").isString().notEmpty(),
  body("title").isString().trim().notEmpty(),
];

async function createDeck(request: Request, response: Response): Promise<void> {
  const { subscriberId, chatIds, isActive, keywords, title, deckTemplateId } =
    request.body as RequestBody;

  const subscriberModel = new SubscriberModel(databaseInstance);
  const subscriber = await subscriberModel.fetchOne(subscriberId);

  if (subscriber == null) {
    throw new InvalidSubscriberError(subscriberId);
  }

  const newDeck: Omit<Deck, "id" | "updatedDate" | "createdDate" | "lastNotificationDate"> = {
    chatIds,
    deckTemplateId,
    isActive,
    keywords,
    subscriberId: subscriberId,
    title,
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
