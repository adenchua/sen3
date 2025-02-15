import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../constants/api";
import ApiResponseWrapper from "../interfaces/api";
import ChatInterface from "../interfaces/chat";

const fetchChats = async (): Promise<ChatInterface[]> => {
  const response = await axios.get<ApiResponseWrapper<ChatInterface[]>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/chats`,
    {
      params: {
        size: 10_000,
      },
    },
  );

  return response.data.data;
};

export default fetchChats;
