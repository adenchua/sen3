import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";

const getTelegramServiceHealth = async (): Promise<boolean> => {
  try {
    await axios.get(`${BACKEND_SERVICE_API_URL}/healthcheck/telegram-service`);
    return true;
  } catch {
    return false;
  }
};

export default getTelegramServiceHealth;
