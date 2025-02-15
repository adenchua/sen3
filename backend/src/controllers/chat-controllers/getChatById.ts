import { Request, Response } from "express";

import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import { invalidTelegramChatIdError } from "../../errors/invalidTelegramChatError";

export default async function getChatById(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  const chatModel = new ChatModel(databaseInstance);
  const result = await chatModel.fetchOne(id);

  if (result == null) {
    throw invalidTelegramChatIdError;
  }

  response.status(200).send(wrapResponse(result));
}
