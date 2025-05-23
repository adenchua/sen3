import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";

const fetchMessagesCount = async (dateFrom: Date, dateTo: Date): Promise<number> => {
  const response = await axios.get<ApiResponseWrapper<number>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/analytics/count/message`,
    {
      params: {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      },
    },
  );

  return response.data.data;
};

export default fetchMessagesCount;
