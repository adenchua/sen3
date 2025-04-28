import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";

const getDatabaseHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get<ApiResponseWrapper<boolean>>(
      `${BACKEND_SERVICE_API_URL}/healthcheck/database`,
    );

    return response.data.data;
  } catch {
    return false;
  }
};

export default getDatabaseHealth;
