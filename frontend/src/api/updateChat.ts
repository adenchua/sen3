import axios from "axios";

import { BACKEND_SERVICE_API_URL } from "../constants/api";

const updateChat = async (id: string, updatedCrawlStatus: boolean): Promise<void> => {
  await axios.patch(`${BACKEND_SERVICE_API_URL}/api/v1/chats/${id}`, {
    crawlActive: updatedCrawlStatus,
    messageOffsetId: null,
  });
};

export default updateChat;
