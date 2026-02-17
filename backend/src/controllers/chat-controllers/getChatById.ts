import { Request, Response } from "express";

import InvalidChatError from "../../errors/chats/InvalidChatError";
import ControllerInterface from "../../interfaces/ControllerInterface";
import { ChatModel } from "../../models/ChatModel";
import { databaseInstance } from "../../singletons";
import wrapResponse from "../../utils/responseUtils";

async function getChatById(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  const chatModel = new ChatModel(databaseInstance);
  const result = await chatModel.fetchOne(id as string);

  if (result == null) {
    throw new InvalidChatError(id as string);
  }

  response.status(200).send(wrapResponse(result));
}

const getChatByIdController: ControllerInterface = {
  controller: getChatById,
  validator: [],
};

export default getChatByIdController;
