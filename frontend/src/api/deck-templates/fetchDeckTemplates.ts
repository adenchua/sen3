import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";
import DeckTemplateInterface from "../../interfaces/deckTemplate";

const fetchDeckTemplates = async (): Promise<DeckTemplateInterface[]> => {
  const response = await axios.get<ApiResponseWrapper<DeckTemplateInterface[]>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/deck-templates`,
  );

  return response.data.data;
};

export default fetchDeckTemplates;
