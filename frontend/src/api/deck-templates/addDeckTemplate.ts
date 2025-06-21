import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";

const addDeckTemplate = async (
  title: string,
  chatIds: string[],
  isDefault: boolean,
): Promise<string> => {
  const response = await axios.post<ApiResponseWrapper<string>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/deck-templates`,
    {
      chatIds,
      title,
      isDefault,
    },
  );

  return response.data.data;
};

export default addDeckTemplate;
