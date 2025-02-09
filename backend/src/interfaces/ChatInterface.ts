export interface ParticipantStat {
  count: number;
  date: Date;
}

/** chat mapping used through the application */
export default interface Chat {
  id: string;
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
