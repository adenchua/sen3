import { TDocument, Flatten, DatabaseDocument } from "./common";

interface ParticipantStat {
  count: number;
  date: Date;
}

interface DParticipantChat {
  count: number;
  date: string;
}

/** chat mapping used through the application */
interface TChat {
  about: string;
  crawlActive: boolean;
  createdDate: Date;
  isChannel: boolean;
  isVerified: boolean;
  lastCrawlDate?: Date | null;
  messageOffsetId?: number | null;
  participantStats: ParticipantStat[];
  recommendedChannels: string[];
  title: string;
  updatedDate: Date;
  username: string;
}

/** chat mapping defined in the database */
export interface DChat {
  about: string;
  crawl_active: boolean;
  created_date: string;
  is_channel: boolean;
  is_verified: boolean;
  last_crawl_date?: string | null;
  message_offset_id?: number | null;
  participant_stats: DParticipantChat[];
  recommended_channels: string[];
  title: string;
  updated_date: string;
  username: string;
}

export type Chat = Flatten<TDocument<TChat>>;
export type DatabaseChat = Flatten<DatabaseDocument<DChat>>;
