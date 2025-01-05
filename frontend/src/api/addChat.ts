import axios from "axios";

import ApiResponseWrapper from "../interfaces/api";
import ChatInterface, { TelegramChatInterface } from "../interfaces/chat";

const addChat = async (chat: TelegramChatInterface): Promise<ChatInterface> => {
  const response = await axios.post<ApiResponseWrapper<ChatInterface>>(
    `http://localhost:5098/api/v1/chats`,
    {
      about: chat.about,
      createdDate: new Date(chat.createdDate).toISOString(),
      id: String(chat.id),
      isChannel: chat.isChannel,
      isVerified: chat.isVerified,
      participantCount: chat.participantsCount,
      title: chat.title,
      username: chat.username,
    }
  );

  return response.data.data;
};

export default addChat;
