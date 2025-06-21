import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import SubscriberAlreadyExistsError from "../../errors/subscribers/SubscriberAlreadyExistsError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import Subscriber from "../../interfaces/SubscriberInterface";
import { DeckTemplateModel } from "../../models/DeckTemplateModel";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";
import { DeckModel } from "../../models/DeckModel";

interface RequestBody {
  userId: string;
  firstName: string;
  lastName?: string;
  username?: string;
}

const validationChains: ValidationChain[] = [
  body("userId").isString().exists(),
  body("firstName").isString().exists(),
  body("lastName").isString().optional({ values: "null" }),
  body("username").isString().optional({ values: "null" }),
];

async function createSubscriber(request: Request, response: Response): Promise<void> {
  const { userId, firstName, lastName, username } = request.body as RequestBody;

  const newSubscriber: Subscriber = {
    id: userId,
    firstName,
    lastName,
    username,
    registeredDate: new Date(),
    allowNotifications: true, // allow notifications by default
    isApproved: false,
  };
  const subscriberModel = new SubscriberModel(databaseInstance);
  const deckTemplateModel = new DeckTemplateModel(databaseInstance);
  const deckModel = new DeckModel(databaseInstance);

  const subscriber = await subscriberModel.fetchOne(userId);

  // already exist, throw error
  if (subscriber != null) {
    throw new SubscriberAlreadyExistsError(userId);
  }

  const newSubscriberId = await subscriberModel.save(newSubscriber);
  const defaultDeckTemplates = await deckTemplateModel.fetch({ isDefault: true, isDeleted: false });

  // add decks from deck templates to this subscriber
  for (const defaultDeckTemplate of defaultDeckTemplates) {
    const { chatIds, title } = defaultDeckTemplate;
    await deckModel.save({
      chatIds,
      title,
      isActive: true,
      keywords: [],
      subscriberId: newSubscriberId,
    });
  }

  response.status(201).send();
}

const createSubscriberController: ControllerInterface = {
  controller: createSubscriber,
  validator: validationChains,
};

export default createSubscriberController;
