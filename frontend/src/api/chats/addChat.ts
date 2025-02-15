import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";
import { TelegramChatInterface } from "../../interfaces/chat";

const addChat = async (chat: TelegramChatInterface): Promise<string> => {
  const response = await axios.post<ApiResponseWrapper<string>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/chats`,
    {
      about: chat.about,
      createdDate: new Date(chat.createdDate).toISOString(),
      id: String(chat.id),
      isChannel: chat.isChannel,
      isVerified: chat.isVerified,
      participantCount: chat.participantsCount,
      title: chat.title,
      username: chat.username,
    },
  );

  return response.data.data;
};

export default addChat;
