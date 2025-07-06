export type TDocument<T> = { id: string } & T;

export type DatabaseDocument<T> = { _id: string } & T;

export type Flatten<T> = { [K in keyof T]: T[K] };

export type DatabaseIndex =
  | "chat"
  | "deck"
  | "deck-template"
  | "message"
  | "notification"
  | "subscriber";
