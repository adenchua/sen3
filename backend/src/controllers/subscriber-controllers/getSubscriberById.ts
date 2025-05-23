import { Request, Response } from "express";

import InvalidSubscriberError from "../../errors/subscribers/InvalidSubscriberError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

async function getSubscriberById(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  const subscriberModel = new SubscriberModel(databaseInstance);
  const result = await subscriberModel.fetchOne(id);

  if (result == null) {
    throw new InvalidSubscriberError(id);
  }

  response.status(200).send(wrapResponse(result));
}

const getSubscriberByIdController: ControllerInterface = {
  controller: getSubscriberById,
  validator: [],
};

export default getSubscriberByIdController;
