import axios from "axios";

import ApiResponseWrapper from "../interfaces/api";
import ChatInterface from "../interfaces/chat";

const fetchChats = async (): Promise<ChatInterface[]> => {
  const response = await axios.get<ApiResponseWrapper<ChatInterface[]>>(
    `http://localhost:5098/api/v1/chats`
  );

  return response.data.data;
};

export default fetchChats;
