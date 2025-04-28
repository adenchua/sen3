import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";

interface HistogramBucket {
  count: number;
  dateISOString: string;
}

const fetchMessagesHistogram = async (): Promise<HistogramBucket[]> => {
  const response = await axios.get<ApiResponseWrapper<HistogramBucket[]>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/analytics/date-histogram/message`,
    {
      params: {
        interval: "day",
      },
    },
  );

  return response.data.data;
};

export default fetchMessagesHistogram;
