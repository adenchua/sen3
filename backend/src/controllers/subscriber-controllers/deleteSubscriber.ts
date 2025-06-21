import { Request, Response } from "express";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";

async function deleteSubscriber(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  const subscriberModel = new SubscriberModel(databaseInstance);
  await subscriberModel.delete(id);

  response.status(204).send();
}

const deleteSubscriberController: ControllerInterface = {
  controller: deleteSubscriber,
  validator: [],
};

export default deleteSubscriberController;
