import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";
import SubscriberInterface from "../../interfaces/subscriber";

const fetchSubscribers = async (isApproved: boolean): Promise<SubscriberInterface[]> => {
  const response = await axios.get<ApiResponseWrapper<SubscriberInterface[]>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/subscribers`,
    {
      params: {
        isApproved: Number(isApproved),
        size: 10_000,
      },
    },
  );

  return response.data.data;
};

export default fetchSubscribers;
