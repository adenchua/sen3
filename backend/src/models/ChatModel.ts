import Chat from "../interfaces/ChatInterface";
import DatabaseService from "../services/DatabaseService";
import QueryBuilder from "../classes/QueryBuilder";

interface ParticipantStat {
  count: number;
  date: string;
}

/** database chat mapping */
interface DatabaseChat {
  _id: string;
  about: string;
  crawl_active: boolean;
  created_date: string;
  is_channel: boolean;
  is_verified: boolean;
  last_crawl_date?: string | null;
  message_offset_id?: number | null;
  participant_stats: ParticipantStat[];
  recommended_channels: string[];
  title: string;
  updated_date: string;
  username: string;
}

export class ChatModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "chat";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  /** Transforms a raw database chat object to a chat object */
  private transformToChat(rawChat: DatabaseChat): Chat {
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
  private transformToRawChat(chat: Partial<Chat>): Partial<DatabaseChat> {
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
  async save(chat: Chat): Promise<string> {
    const rawChat = this.transformToRawChat(chat);
    const { _id: id, ...rest } = rawChat;
    const response = await this.databaseService.ingestDocument(rest, this.DATABASE_INDEX, id);

    return response;
  }

  /** Fetches chats in the database */
  async fetch(
    fields: { crawlActive?: boolean; ids?: string[] },
    from = 0,
    size = 10,
  ): Promise<Chat[]> {
    const { crawlActive, ids } = fields;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);

    if (crawlActive != undefined) {
      queryBuilder.addTermQuery("crawl_active", crawlActive);
    }

    if (ids != undefined) {
      queryBuilder.addTermsQuery("_id", ids);
    }

    const query = queryBuilder.getQuery();
    const response = await this.databaseService.fetchDocuments<DatabaseChat>(
      this.DATABASE_INDEX,
      query,
    );

    const result = response.map((rawChat) =>
      this.transformToChat(rawChat as unknown as DatabaseChat),
    );

    return result;
  }

  async fetchOne(id: string): Promise<Chat | null> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(0, 1);
    queryBuilder.addTermQuery("_id", id);
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments(this.DATABASE_INDEX, query);

    if (response.length === 0) {
      return null;
    }

    const [result] = response.map((rawChat) =>
      this.transformToChat(rawChat as unknown as DatabaseChat),
    );

    return result;
  }

  async update(chatId: string, updatedFields: Partial<Chat>) {
    // transform to database mapping
    const transformedUpdatedFields = this.transformToRawChat(updatedFields);

    const response = await this.databaseService.updateDocument<DatabaseChat>(
      this.DATABASE_INDEX,
      chatId,
      transformedUpdatedFields,
    );

    return response;
  }
}
