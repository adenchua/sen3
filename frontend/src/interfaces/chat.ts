interface ChatInterface {
  id: string;
  about: string;
  crawlActive: boolean;
  createdDate: string;
  isChannel: boolean;
  isVerified: boolean;
  lastCrawlDate: null | string;
  messageOffsetId: null | number;
  participantStats: ParticipantStat[];
  recommendedChannels: string[];
  title: string;
  updatedDate: string;
  username: string;
}

export interface ParticipantStat {
  count: number;
  date: string;
}

export default ChatInterface;
