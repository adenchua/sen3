import { DatabaseDocument, Flatten, TDocument } from "./common";

export interface TSubscriber {
  id: string;
  allowNotifications: boolean;
  firstName: string;
  isApproved: boolean;
  lastName?: string;
  registeredDate: Date;
  username?: string;
}

export interface DSubscriber {
  _id: string;
  allow_notifications: boolean;
  first_name: string;
  is_approved: boolean;
  last_name?: string;
  registered_date: string;
  username?: string;
}

export type DatabaseSubscriber = Flatten<DatabaseDocument<DSubscriber>>;
export type Subscriber = Flatten<TDocument<TSubscriber>>;
