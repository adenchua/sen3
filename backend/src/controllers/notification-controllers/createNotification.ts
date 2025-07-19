import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { Notification } from "../../interfaces/NotificationInterface";
import { NotificationModel } from "../../models/NotificationModel";
import { databaseInstance } from "../../singletons";

interface RequestBody {
  chatId: string;
  keywords: string[];
  message: string;
  messageId: string;
  subscriberId: string;
}

const validationChains: ValidationChain[] = [
  body("chatId").isString().exists(),
  body("keywords").isArray().exists(),
  body("keywords.*").isString(),
  body("message").isString().exists(),
  body("messageId").isString().exists(),
  body("subscriberId").isString().exists(),
];

async function createNotification(request: Request, response: Response): Promise<void> {
  const { chatId, keywords, message, messageId, subscriberId } = request.body as RequestBody;

  const newNotification: Notification = {
    id: `${chatId}:${messageId}:${subscriberId}`,
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

const createNotificationController: ControllerInterface = {
  controller: createNotification,
  validator: validationChains,
};

export default createNotificationController;
