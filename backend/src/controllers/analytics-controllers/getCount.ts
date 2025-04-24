import { Request, Response } from "express";
import { param, query, ValidationChain } from "express-validator";

import { MessageModel } from "../../models/MessageModel";
import { NotificationModel } from "../../models/NotificationModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

const ALLOWED_ENTITIES = ["message", "notification"] as const;
type Entity = (typeof ALLOWED_ENTITIES)[number];

interface RequestParams {
  entity: Entity;
}

interface RequestQuery {
  dateFrom: string;
  dateTo: string;
}

export const getCountValidationChain: ValidationChain[] = [
  param("entity").isIn(ALLOWED_ENTITIES),
  query("dateFrom").isISO8601().exists(),
  query("dateTo").isISO8601().exists(),
];

export default async function getCount(request: Request, response: Response): Promise<void> {
  const { entity } = request.params as unknown as RequestParams;
  const { dateFrom, dateTo } = request.query as unknown as RequestQuery;

  const messageModel = new MessageModel(databaseInstance);
  const notificationModel = new NotificationModel(databaseInstance);

  let result: number = -1;

  if (entity === "message") {
    result = await messageModel.getCount("created_date", dateFrom, dateTo);
  }

  if (entity === "notification") {
    result = await notificationModel.getCount("notification_date", dateFrom, dateTo);
  }

  response.send(wrapResponse(result));
}
