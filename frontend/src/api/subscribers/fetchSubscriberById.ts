import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import ApiResponseWrapper from "../../interfaces/api";
import SubscriberInterface from "../../interfaces/subscriber";

const fetchSubscriberById = async (id: string): Promise<SubscriberInterface> => {
  const response = await axios.get<ApiResponseWrapper<SubscriberInterface>>(
    `${BACKEND_SERVICE_API_URL}/api/v1/subscribers/${id}`,
  );

  return response.data.data;
};

export default fetchSubscriberById;
