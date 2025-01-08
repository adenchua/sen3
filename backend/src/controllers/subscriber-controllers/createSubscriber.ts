import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import { databaseInstance } from "../../singletons";
import Subscriber from "../../interfaces/SubscriberInterface";
import { SubscriberModel } from "../../models/SubscriberModel";

interface RequestBody {
  userId: string;
  firstName: string;
  lastName?: string;
  username?: string;
}

export const createSubscriberValidationChains: ValidationChain[] = [
  body("userId").isString().exists(),
  body("firstName").isString().exists(),
  body("lastName").isString().optional(),
  body("username").isString().optional(),
];

export default async function createSubscriber(
  request: Request,
  response: Response,
): Promise<void> {
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

  const subscriberModel = new SubscriberModel(databaseInstance, newSubscriber);
  await subscriberModel.save();

  response.status(201).send();
}
