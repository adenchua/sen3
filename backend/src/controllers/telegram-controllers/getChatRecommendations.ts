import { Request, Response } from "express";

import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

export default async function getChannelRecommendations(
  request: Request,
  response: Response,
): Promise<void> {
  const { chatUsername } = request.params;

  const channels = await telegramInstance.fetchRecommendedChats(chatUsername);

  response.status(200).send(wrapResponse(channels));
}
