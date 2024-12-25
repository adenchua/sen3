import Chat from "../interfaces/ChatInterface";
import DatabaseService from "../services/DatabaseService";

interface ParticipantStat {
  count: number;
  date: string;
}

/** database chat mapping */
interface RawChat {
  _id: string;
  about: string;
  crawl_active: boolean;
  created_date: string;
  is_channel: boolean;
  is_verified: boolean;
  last_crawl_date: string | null;
  message_offset_id: number | null;
  participant_stats: ParticipantStat[];
  recommended_channels: string[];
  title: string;
  updated_date: string;
  username: string;
}

export class ChatModel {
  private chat: Chat | null;
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "chat";

  constructor(databaseService: DatabaseService, chat?: Chat) {
    if (chat) {
      this.chat = chat;
    }
    this.databaseService = databaseService;
  }

  /** Transforms a raw database chat object to a chat object */
  private transformToChat(rawChat: RawChat): Chat {
    // convert dates from iso string to date object
    const transformedParticipantStats = rawChat.participant_stats.map((participantStat) => {
      const { count, date } = participantStat;
      return { count, date: new Date(date) };
    });

    return {
      id: rawChat._id,
      about: rawChat.about,
      crawlActive: rawChat.crawl_active,
      createdDate: new Date(rawChat.created_date),
      isChannel: rawChat.is_channel,
      isVerified: rawChat.is_verified,
      lastCrawlDate: rawChat.last_crawl_date ? new Date(rawChat.last_crawl_date) : null,
      messageOffsetId: rawChat.message_offset_id,
      participantStats: transformedParticipantStats,
      recommendedChannels: rawChat.recommended_channels,
      title: rawChat.title,
      updatedDate: new Date(rawChat.updated_date),
      username: rawChat.username,
    };
  }

  /** Transforms a chat object to a raw chat object */
  private transformToRawChat(chat: Chat): RawChat {
    // convert dates from Date object to iso string
    const transformedParticipantStats = chat.participantStats.map((participantStat) => {
      const { count, date } = participantStat;
      return { count, date: date.toISOString() };
    });

    return {
      _id: chat.id,
      about: chat.about,
      crawl_active: chat.crawlActive,
      created_date: chat.createdDate.toISOString(),
      is_channel: chat.isChannel,
      is_verified: chat.isVerified,
      last_crawl_date: chat.lastCrawlDate == null ? null : chat.lastCrawlDate.toISOString(),
      message_offset_id: chat.messageOffsetId,
      participant_stats: transformedParticipantStats,
      recommended_channels: chat.recommendedChannels,
      title: chat.title,
      updated_date: chat.updatedDate.toISOString(),
      username: chat.username,
    };
  }

  /** Creates a chat in the database */
  async save(): Promise<void> {
    if (this.chat == null) {
      return;
    }

    const rawChat = this.transformToRawChat(this.chat);
    const { _id: id, ...rest } = rawChat;
    await this.databaseService.ingestDocument(rest, id, this.DATABASE_INDEX);
  }

  /** Fetches documents from an index in the database */
  async fetch(fields: { crawlActive?: boolean }, from = 0, size = 10): Promise<Chat[]> {
    const { crawlActive } = fields;
    const response = await this.databaseService.fetchDocuments<RawChat>(this.DATABASE_INDEX, {
      from,
      size,
      query: {
        bool: {
          must: [
            ...(crawlActive != undefined
              ? [
                  {
                    term: {
                      crawl_active: {
                        value: crawlActive,
                      },
                    },
                  },
                ]
              : []),
          ],
        },
      },
    });

    const result = response.map((rawChat) => this.transformToChat(rawChat as unknown as RawChat));

    return result;
  }
}
