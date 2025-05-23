import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import SubscriberAlreadyExistsError from "../../errors/subscribers/SubscriberAlreadyExistsError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import Subscriber from "../../interfaces/SubscriberInterface";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";

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

  const subscriber = await subscriberModel.fetchOne(userId);

  // already exist, throw error
  if (subscriber != null) {
    throw new SubscriberAlreadyExistsError(userId);
  }

  await subscriberModel.save(newSubscriber);

  response.status(201).send();
}

const createSubscriberController: ControllerInterface = {
  controller: createSubscriber,
  validator: validationChains,
};

export default createSubscriberController;
