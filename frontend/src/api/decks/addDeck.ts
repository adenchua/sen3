import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";

const addDeck = async (subscriberId: string, title: string): Promise<string> => {
  const response = await axios.post<ApiResponseWrapper<string>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/decks`,
    {
      subscriberId,
      chatIds: [],
      title,
      isActive: false,
      keywords: [],
    },
  );

  return response.data.data;
};

export default addDeck;
