import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import Notification from "../../interfaces/NotificationInterface";
import { NotificationModel } from "../../models/NotificationModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  chatId: string;
  keywords: string[];
  message: string;
  subscriberId: string;
}

export const createNotificationValidationChains: ValidationChain[] = [
  body("chatId").isString().exists(),
  body("keywords").isArray().exists(),
  body("keywords.*").isString(),
  body("message").isString().exists(),
  body("subscriberId").isString().exists(),
];

export default async function createNotification(
  request: Request,
  response: Response,
): Promise<void> {
  const { chatId, keywords, message, subscriberId } = request.body as RequestBody;

  const newNotification: Notification = {
    chatId,
    keywords,
    message,
    notificationDate: new Date(),
    subscriberId,
  };

  const notificationModel = new NotificationModel(databaseInstance);
  await notificationModel.save(newNotification);

  response.status(201).send();
}
