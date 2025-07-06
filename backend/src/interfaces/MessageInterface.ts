import { Flatten, DatabaseDocument, TDocument } from "./common";

interface TMessage {
  chatId: string;
  createdDate: Date;
  chatUsername: string;
  editedDate: Date | null;
  forwardCount: number;
  messageId: string;
  text: string;
  updatedDate: Date;
  viewCount: number;
}

export interface DMessage {
  chat_id: string;
  created_date: string;
  chat_username: string;
  edited_date: string | null;
  forward_count: number;
  message_id: string;
  text: string;
  updated_date: string;
  view_count: number;
}

export type DatabaseMessage = Flatten<DatabaseDocument<DMessage>>;
export type Message = Flatten<TDocument<TMessage>>;
