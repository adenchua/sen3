import axios, { AxiosResponse } from "axios";

import MaxMessageLimitError from "../errors/chats/MaxMessageLimitError";
import InternalServerError from "../errors/InternalServerError";
import handleAxiosError from "../utils/axiosErrorHandler";

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
  chat_id: number;
  chat_username: string;
  created_date: string;
  edited_date: string;
  forward_count: number;
  id: number;
  text: string;
  view_count: number;
}

interface ParsedTelegramMessage {
  chatId: number;
  chatUsername: string;
  createdDate: string;
  editedDate: string;
  forwardCount: number;
  id: number;
  text: string;
  viewCount: number;
}

export default class TelegramService {
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

  private parseMessage(message: TelegramMessage): ParsedTelegramMessage {
    return {
      chatId: message.chat_id,
      chatUsername: message.chat_username,
      createdDate: message.created_date,
      editedDate: message.edited_date,
      forwardCount: message.forward_count,
      id: message.id,
      text: message.text,
      viewCount: message.view_count,
    };
  }

  async fetchTelegramChat(chatUsername: string): Promise<ParsedTelegramChat | null> {
    const apiUrl = `${this.telegramAPIUrl}/api/v1/chats/${chatUsername}`;

    try {
      const response = await axios.get<AxiosResponse<TelegramChat>>(apiUrl);

      let result: ParsedTelegramChat | null = null;

      if (response.data.data) {
        result = this.parseChat(response.data.data);
      }

      return result;
    } catch (error) {
      handleAxiosError(error);
      throw new InternalServerError();
    }
  }

  async fetchTelegramChatMessages(
    chatUsername: string,
    limit = 10,
    latest = false,
    offsetId = 0,
  ): Promise<ParsedTelegramMessage[]> {
    if (limit && limit > 1000) {
      throw new MaxMessageLimitError();
    }

    const apiURL = `${this.telegramAPIUrl}/api/v1/chats/${chatUsername}/messages`;

    try {
      const response = await axios.get<AxiosResponse<TelegramMessage[]>>(apiURL, {
        params: { limit, reverse: !latest, offset_id: offsetId },
      });

      const result: ParsedTelegramMessage[] = response.data.data.map((telegramMessage) => {
        return this.parseMessage(telegramMessage);
      });

      return result;
    } catch (error) {
      handleAxiosError(error);
      throw new InternalServerError();
    }
  }

  async fetchTelegramRecommendedChats(chatUsername: string): Promise<ParsedTelegramChat[]> {
    const apiURL = `${this.telegramAPIUrl}/api/v1/chats/${chatUsername}/recommendations`;

    try {
      const response = await axios.get<AxiosResponse<TelegramChat[]>>(apiURL);

      let result: ParsedTelegramChat[] = [];

      if (response.data.data) {
        result = response.data.data.map((telegramChat) => this.parseChat(telegramChat));
      }

      return result;
    } catch (error) {
      handleAxiosError(error);
      throw new InternalServerError();
    }
  }
}
