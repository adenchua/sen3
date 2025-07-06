import { DatabaseDocument, Flatten, TDocument } from "./common";

interface TDeck {
  chatIds: string[];
  createdDate: Date;
  deckTemplateId?: string;
  isActive: boolean;
  keywords: string[];
  lastNotificationDate: Date;
  subscriberId: string;
  title: string;
  updatedDate: Date;
}

export interface DDeck {
  chat_ids: string[];
  created_date: string;
  deck_template_id?: string;
  is_active: boolean;
  keywords: string[];
  last_notification_date: string;
  subscriber_id: string;
  title: string;
  updated_date: string;
}

export type DatabaseDeck = Flatten<DatabaseDocument<DDeck>>;
export type Deck = Flatten<TDocument<TDeck>>;
