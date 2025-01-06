import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../constants/api";
import ApiResponseWrapper from "../interfaces/api";
import { TelegramChatInterface } from "../interfaces/chat";

const fetchTelegramChat = async (chatUsername: string): Promise<TelegramChatInterface> => {
  const response = await axios.get<ApiResponseWrapper<TelegramChatInterface>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/telegram/chats/${chatUsername}`,
  );

  return response.data.data;
};

export default fetchTelegramChat;
