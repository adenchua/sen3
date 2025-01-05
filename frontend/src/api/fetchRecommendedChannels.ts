import axios from "axios";

import ApiResponseWrapper from "../interfaces/api";
import ChatInterface from "../interfaces/chat";

const fetchRecommendedChannels = async (
  chatUsername: string
): Promise<ChatInterface[]> => {
  const response = await axios.get<ApiResponseWrapper<ChatInterface[]>>(
    `http://localhost:5098/api/v1/telegram/chats/${chatUsername}/recommendations`
  );

  return response.data.data;
};

export default fetchRecommendedChannels;
