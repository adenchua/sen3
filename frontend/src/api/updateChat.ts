import axios from "axios";

const updateChat = async (
  id: string,
  updatedCrawlStatus: boolean
): Promise<void> => {
  await axios.patch(`http://localhost:5098/api/v1/chats/${id}`, {
    crawlActive: updatedCrawlStatus,
    messageOffsetId: null,
  });
};

export default updateChat;
