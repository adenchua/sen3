import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../constants/api";

const approveRegistrant = async (id: string): Promise<void> => {
  await axios.post(`${BACKEND_SERVICE_API_URL}/api/v1/subscribers/${id}/approve`);
};

export default approveRegistrant;
