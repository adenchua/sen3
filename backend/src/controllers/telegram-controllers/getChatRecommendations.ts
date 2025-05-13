import { Request, Response } from "express";

import ControllerInterface from "../../interfaces/ControllerInterface";
import { telegramInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

async function getChannelRecommendations(request: Request, response: Response): Promise<void> {
  const { chatUsername } = request.params;

  const channels = await telegramInstance.fetchTelegramRecommendedChats(chatUsername);

  response.status(200).send(wrapResponse(channels));
}

const getChannelRecommendationsController: ControllerInterface = {
  controller: getChannelRecommendations,
  validator: [],
};

export default getChannelRecommendationsController;
