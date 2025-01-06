import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../constants/api";
import ApiResponseWrapper from "../interfaces/api";
import ChatInterface from "../interfaces/chat";

const fetchRecommendedChannels = async (chatUsername: string): Promise<ChatInterface[]> => {
  const response = await axios.get<ApiResponseWrapper<ChatInterface[]>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/telegram/chats/${chatUsername}/recommendations`,
  );

  return response.data.data;
};

export default fetchRecommendedChannels;
