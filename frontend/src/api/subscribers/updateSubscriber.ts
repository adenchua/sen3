import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";
import SubscriberInterface from "../../interfaces/subscriber";

const updateSubscriber = async (
  id: string,
  updatedFields: Partial<SubscriberInterface>,
): Promise<void> => {
  const { allowNotifications, isApproved } = updatedFields;

  await axios.patch(`${BACKEND_SERVICE_API_URL}/api/v1/subscribers/${id}`, {
    allowNotifications,
    isApproved,
  });
};

export default updateSubscriber;
