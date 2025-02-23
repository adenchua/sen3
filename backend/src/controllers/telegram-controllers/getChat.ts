import { Request, Response } from "express";

import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";
import InvalidChatError from "../../errors/chats/InvalidChatError";

export default async function getChat(request: Request, response: Response): Promise<void> {
  const { chatUsername } = request.params;

  const chat = await telegramInstance.fetchTelegramChat(chatUsername);

  if (chat == null) {
    throw new InvalidChatError(chatUsername);
  }

  response.status(200).send(wrapResponse(chat));
}
