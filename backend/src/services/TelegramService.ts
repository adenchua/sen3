import axios, { AxiosResponse } from "axios";

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

interface ParsedTelegramChat {
  about: string;
  createdDate: string;
  id: number;
  isChannel: boolean;
  isVerified: boolean;
  participantsCount: number;
  title: string;
  username: string;
}

interface TelegramMessage {
  chat_id: string;
  created_date: string;
  edited_date: string;
  forward_count: number;
  id: number;
  text: string;
  view_count: number;
}

interface ParsedTelegramMesssage {
  chatId: string;
  createdDate: string;
  editedDate: string;
  forwardCount: number;
  id: number;
  text: string;
  viewCount: number;
}

class TelegramService {
  private telegramAPIUrl: string;

  constructor(telegramAPIUrl: string) {
    this.telegramAPIUrl = telegramAPIUrl;
  }

  private parseChat(chat: TelegramChat): ParsedTelegramChat {
    return {
      about: chat.about,
      createdDate: chat.created_date,
      id: chat.id,
      isChannel: chat.is_channel,
      isVerified: chat.is_verified,
      participantsCount: chat.participants_count,
      title: chat.title,
      username: chat.username,
    };
  }

  private parseMessage(message: TelegramMessage): ParsedTelegramMesssage {
    return {
      chatId: message.chat_id,
      createdDate: message.created_date,
      editedDate: message.edited_date,
      forwardCount: message.forward_count,
      id: message.id,
      text: message.text,
      viewCount: message.view_count,
    };
  }

  async fetchChat(chatUsername: string): Promise<ParsedTelegramChat | null> {
    const apiUrl = `${this.telegramAPIUrl}/api/v1/chats/${chatUsername}`;
    const response = await axios.get<AxiosResponse<TelegramChat>>(apiUrl);

    let result: ParsedTelegramChat | null = null;

    if (response.data.data) {
      result = this.parseChat(response.data.data);
    }

    return result;
  }

  async fetchChatMessages(chatUsername: string, limit = 10): Promise<ParsedTelegramMesssage[]> {
    if (limit && limit > 1000) {
      throw Error("MaxLimitTelegramMessageException: please keep limit to below 1000");
    }

    const apiURL = `${this.telegramAPIUrl}/api/v1/chats/${chatUsername}/messages`;
    const response = await axios.get<AxiosResponse<TelegramMessage[]>>(apiURL, {
      params: { limit },
    });

    const result: ParsedTelegramMesssage[] = response.data.data.map((telegramMessage) => {
      return this.parseMessage(telegramMessage);
    });

    return result;
  }
}

export default TelegramService;
