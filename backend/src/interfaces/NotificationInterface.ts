import { DatabaseDocument, Flatten, TDocument } from "./common";

export interface TNotification {
  chatId: string;
  keywords: string[];
  message: string;
  notificationDate: Date;
  subscriberId: string;
}

export interface DNotification {
  chat_id: string;
  keywords: string[];
  message: string;
  notification_date: string;
  subscriber_id: string;
}

export type DatabaseNotification = Flatten<DatabaseDocument<DNotification>>;
export type Notification = Flatten<TDocument<TNotification>>;
