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
  private databaseIndex: string = "chat";

  constructor(databaseService: DatabaseService, chat?: Chat) {
    if (chat) {
      this.chat = chat;
    }
    this.databaseService = databaseService;
  }

  /** Transforms a chat object to a raw chat object */
  private transformToRawChat(): RawChat | null {
    if (this.chat == null) {
      return null;
    }
    // convert dates from Date object to iso string
    const transformedParticipantStats = this.chat.participantStats.map((participantStat) => {
      const { count, date } = participantStat;
      return { count, date: date.toISOString() };
    });

    return {
      _id: this.chat.id,
      about: this.chat.about,
      crawl_active: this.chat.crawlActive,
      created_date: this.chat.createdDate.toISOString(),
      is_channel: this.chat.isChannel,
      is_verified: this.chat.isVerified,
      last_crawl_date:
        this.chat.lastCrawlDate == null ? null : this.chat.lastCrawlDate.toISOString(),
      message_offset_id: this.chat.messageOffsetId,
      participant_stats: transformedParticipantStats,
      recommended_channels: this.chat.recommendedChannels,
      title: this.chat.title,
      updated_date: this.chat.updatedDate.toISOString(),
      username: this.chat.username,
    };
  }

  /** Creates a chat in the database */
  async save(): Promise<void> {
    if (this.chat == null) {
      return;
    }

    // need type assertion to be partial since _id field is deleted before ingestion
    const rawChat = this.transformToRawChat() as Partial<RawChat>;
    const documentId = rawChat._id as string;
    delete rawChat["_id"];
    await this.databaseService.ingestDocument(rawChat, documentId, this.databaseIndex);
  }
}
