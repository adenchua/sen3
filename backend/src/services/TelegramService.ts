import axios from "axios";

interface TelegramChat {
  about: string;
  created_date: string;
  id: number;
  is_channel: boolean;
  is_verified: boolean;
  participants_count: number;
  title: string;
  username: string;
}

class TelegramService {
  private telegramAPIUrl: string;

  constructor(telegramAPIUrl: string) {
    this.telegramAPIUrl = telegramAPIUrl;
  }

  async fetchChat(chatUsername: string): Promise<TelegramChat | null> {
    const apiUrl = `${this.telegramAPIUrl}/api/v1/chats/${chatUsername}`;
    const response = await axios.get(apiUrl);

    return response.data.data;
  }

  async fetchChatMessages(chatUsername: string, limit = 10) {
    if (limit && limit > 1000) {
      throw Error("MaxLimitTelegramMessageException: please keep limit to below 1000");
    }

    const apiURL = `${this.telegramAPIUrl}/api/v1/chats/${chatUsername}/messages`;
    const response = await axios.get(apiURL, { params: { limit } });

    return response.data.data;
  }
}

export default TelegramService;
