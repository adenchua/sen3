import { Request, Response } from "express";

import invalidTelegramChatError from "../../errors/invalidTelegramChatError";
import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

export default async function getChat(request: Request, response: Response): Promise<void> {
  const { chatUsername } = request.params;

  const chat = await telegramInstance.fetchChat(chatUsername);

  if (chat == null) {
    throw invalidTelegramChatError;
  }

  response.status(200).send(wrapResponse(chat));
}
