import axios from "axios";

import ApiResponseWrapper from "../interfaces/api";
import { TelegramChatInterface } from "../interfaces/chat";

const fetchTelegramChat = async (
  chatUsername: string
): Promise<TelegramChatInterface> => {
  const response = await axios.get<ApiResponseWrapper<TelegramChatInterface>>(
    `http://localhost:5098/api/v1/telegram/chats/${chatUsername}`
  );

  return response.data.data;
};

export default fetchTelegramChat;
