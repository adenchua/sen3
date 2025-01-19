import { Request, Response } from "express";

import { invalidSubscriberError } from "../../errors/subscriberError";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

export default async function getSubscriberById(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = request.params;

  const subscriberModel = new SubscriberModel(databaseInstance);
  const result = await subscriberModel.fetchOne(id);

  if (result == null) {
    throw invalidSubscriberError;
  }

  response.status(200).send(wrapResponse(result));
}
