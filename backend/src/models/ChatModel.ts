import Chat from "../interfaces/ChatInterface";
import DatabaseService from "../services/DatabaseService";
import QueryBuilder from "../classes/QueryBuilder";

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
  last_crawl_date?: string;
  message_offset_id?: number;
  participant_stats: ParticipantStat[];
  recommended_channels: string[];
  title: string;
  updated_date: string;
  username: string;
}

export class ChatModel {
  private chat: Chat | null = null;
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
      lastCrawlDate: rawChat.last_crawl_date ? new Date(rawChat.last_crawl_date) : undefined,
      messageOffsetId: rawChat.message_offset_id,
      participantStats: transformedParticipantStats,
      recommendedChannels: rawChat.recommended_channels,
      title: rawChat.title,
      updatedDate: new Date(rawChat.updated_date),
      username: rawChat.username,
    };
  }

  /** Transforms a chat object to a raw chat object */
  private transformToRawChat(chat: Partial<Chat>): Partial<RawChat> {
    // convert dates from Date object to iso string
    const transformedParticipantStats = chat.participantStats?.map((participantStat) => {
      const { count, date } = participantStat;
      return { count, date: date.toISOString() };
    });

    return {
      _id: chat.id,
      about: chat.about,
      crawl_active: chat.crawlActive,
      created_date: chat.createdDate?.toISOString(),
      is_channel: chat.isChannel,
      is_verified: chat.isVerified,
      last_crawl_date: chat.lastCrawlDate?.toISOString(),
      message_offset_id: chat.messageOffsetId,
      participant_stats: transformedParticipantStats,
      recommended_channels: chat.recommendedChannels,
      title: chat.title,
      updated_date: chat.updatedDate?.toISOString(),
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
    await this.databaseService.ingestDocument(rest, this.DATABASE_INDEX, id);
  }

  /** Fetches chats in the database */
  async fetch(fields: { crawlActive?: boolean }, from = 0, size = 10): Promise<Chat[]> {
    const { crawlActive } = fields;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);

    if (crawlActive != undefined) {
      queryBuilder.addTermQuery("crawl_active", crawlActive);
    }

    const query = queryBuilder.getQuery();
    const response = await this.databaseService.fetchDocuments<RawChat>(this.DATABASE_INDEX, query);

    const result = response.map((rawChat) => this.transformToChat(rawChat as unknown as RawChat));

    return result;
  }

  async fetchOne(id: string): Promise<Chat> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(0, 1);
    queryBuilder.addTermQuery("_id", id);
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments(this.DATABASE_INDEX, query);

    const [result] = response.map((rawChat) => this.transformToChat(rawChat as unknown as RawChat));

    return result;
  }

  async update(chatId: string, updatedFields: Partial<Chat>) {
    // transform to database mapping
    const transformedUpdatedFields = this.transformToRawChat(updatedFields);

    const response = await this.databaseService.updateDocument<RawChat>(
      this.DATABASE_INDEX,
      chatId,
      transformedUpdatedFields,
    );

    return response;
  }
}
