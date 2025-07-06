import { DatabaseDocument, Flatten, TDocument } from "./common";

interface TDeckTemplate {
  chatIds: string[];
  createdDate: Date;
  isDeleted: boolean;
  isDefault: boolean;
  title: string;
  updatedDate: Date;
}

export interface DDeckTemplate {
  chat_ids: string[];
  created_date: string;
  is_deleted: boolean;
  is_default: boolean;
  title: string;
  updated_date: string;
}

export type DatabaseDeckTemplate = Flatten<DatabaseDocument<DDeckTemplate>>;
export type DeckTemplate = Flatten<TDocument<TDeckTemplate>>;
