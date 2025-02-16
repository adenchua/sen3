import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";
import DeckInterface from "../../interfaces/deck";

const fetchDecksBySubscriber = async (id: string): Promise<DeckInterface[]> => {
  const response = await axios.get<ApiResponseWrapper<DeckInterface[]>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/subscribers/${id}/decks`,
  );

  return response.data.data;
};

export default fetchDecksBySubscriber;
