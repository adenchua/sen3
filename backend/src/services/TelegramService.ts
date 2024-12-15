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
}

export default TelegramService;
