import { Request, Response } from "express";

import { telegramInstance } from "../../singletons";

export default async function getChat(request: Request, response: Response): Promise<void> {
  const { chatUsername } = request.params;

  const chat = await telegramInstance.fetchChat(chatUsername);

  response.status(200).send({ data: chat });
}
