import { Request, Response } from "express";
import { ValidationChain, query } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { SubscriberModel } from "../../models/SubscriberModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import transformQueryParam from "../utils/queryParamTransformer";

interface RequestQuery {
  from?: string;
  size?: string;
  isApproved?: string;
  allowNotifications?: string;
}

const validationChains: ValidationChain[] = [
  query("allowNotifications").isIn([0, 1]).optional(),
  query("isApproved").isIn([0, 1]).optional(),
  query("from").isInt({ min: 0, max: 10_000 }).optional(),
  query("size").isInt({ min: 0, max: 10_000 }).optional(),
];

async function getSubscribers(request: Request, response: Response): Promise<void> {
  const { from, size, isApproved, allowNotifications } = request.query as RequestQuery;

  const _from = transformQueryParam<number>(from, Number);
  const _size = transformQueryParam<number>(size, Number);
  const _isApproved = transformQueryParam<boolean>(isApproved, Boolean);
  const _allowNotifications = transformQueryParam<boolean>(allowNotifications, Boolean);

  const subscriberModel = new SubscriberModel(databaseInstance);
  const result = await subscriberModel.fetch(
    { isApproved: _isApproved, allowNotifications: _allowNotifications },
    _from,
    _size,
  );

  response.status(200).send(wrapResponse(result));
}

const getSubscribersController: ControllerInterface = {
  controller: getSubscribers,
  validator: validationChains,
};

export default getSubscribersController;
