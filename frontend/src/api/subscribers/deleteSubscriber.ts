import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../../constants/api";

const deleteSubscriber = async (id: string): Promise<void> => {
  await axios.delete(`${BACKEND_SERVICE_API_URL}/api/v1/subscribers/${id}`);
};

export default deleteSubscriber;
