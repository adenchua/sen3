import { Request, Response } from "express";

import { body, ValidationChain } from "express-validator";
import InvalidSubscriberError from "../../errors/subscribers/InvalidSubscriberError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  isApproved: boolean;
  allowNotifications: boolean;
}

const validationChains: ValidationChain[] = [
  body("isApproved").isBoolean().optional(),
  body("allowNotifications").isBoolean().optional(),
];

async function updateSubscriber(request: Request, response: Response): Promise<void> {
  const { id } = request.params;
  const { allowNotifications, isApproved } = <RequestBody>request.body;

  const subscriberModel = new SubscriberModel(databaseInstance);

  const subscriber = await subscriberModel.fetchOne(id);
  if (subscriber == null) {
    throw new InvalidSubscriberError(id);
  }

  await subscriberModel.update(id, { isApproved, allowNotifications });

  response.status(204).send();
}

const updateSubscriberController: ControllerInterface = {
  controller: updateSubscriber,
  validator: validationChains,
};

export default updateSubscriberController;
