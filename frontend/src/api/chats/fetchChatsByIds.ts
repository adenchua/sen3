import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";
import ChatInterface from "../../interfaces/chat";

const fetchChatsByIds = async (ids: string[]): Promise<ChatInterface[]> => {
  const response = await axios.post<ApiResponseWrapper<ChatInterface[]>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/chats/ids`,
    {
      ids,
    },
  );

  return response.data.data;
};

export default fetchChatsByIds;
