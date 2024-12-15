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
}
