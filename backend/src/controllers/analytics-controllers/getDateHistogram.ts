import { Request, Response } from "express";
import { param, query, ValidationChain } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { DateHistogramResponse } from "../../interfaces/ResponseInterface";
import { MessageModel } from "../../models/MessageModel";
import { NotificationModel } from "../../models/NotificationModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

const ALLOWED_ENTITIES = ["message", "notification"] as const;
type Entity = (typeof ALLOWED_ENTITIES)[number];

const ALLOWED_CALENDAR_INTERVALS = ["hour", "day", "month"] as const;
type CalendarIntervals = (typeof ALLOWED_CALENDAR_INTERVALS)[number];

interface RequestParams {
  entity: Entity;
}

interface RequestQuery {
  interval: CalendarIntervals;
}

const validationChains: ValidationChain[] = [
  param("entity").isIn(ALLOWED_ENTITIES),
  query("interval").isIn(ALLOWED_CALENDAR_INTERVALS),
];

async function getDateHistogram(request: Request, response: Response): Promise<void> {
  const { entity } = request.params as unknown as RequestParams;
  const { interval } = request.query as unknown as RequestQuery;

  const messageModel = new MessageModel(databaseInstance);
  const notificationModel = new NotificationModel(databaseInstance);

  let result: DateHistogramResponse = [];

  if (entity === "message") {
    result = await messageModel.getDateHistogram("created_date", interval);
  }

  if (entity === "notification") {
    result = await notificationModel.getDateHistogram("notification_date", interval);
  }

  response.send(wrapResponse(result));
}

const getDateHistogramController: ControllerInterface = {
  controller: getDateHistogram,
  validator: validationChains,
};

export default getDateHistogramController;
