import { Request, Response } from "express";

import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";

export default async function approveSubscriber(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = request.params;

  const subscriberModel = new SubscriberModel(databaseInstance);
  await subscriberModel.update(id, { isApproved: true });

  response.status(204).send();
}
