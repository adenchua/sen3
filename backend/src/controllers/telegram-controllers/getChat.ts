import { Request, Response } from "express";

import { telegramInstance } from "../../singletons";

interface RequestParams {
  chatUsername: string;
}

export default async function getChat(request: Request, response: Response): Promise<void> {
  const { chatUsername } = request.params as unknown as RequestParams;

  const chat = await telegramInstance.fetchChat(chatUsername);

  response.status(200).send({ data: chat });
}
