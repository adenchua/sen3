import Message from "../interfaces/MessageInterface";
import DatabaseService from "../services/DatabaseService";

interface RawMessage {
  _id: string;
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

export class MessageModel {
  private message: Message | null = null;
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "message";

  constructor(databaseService: DatabaseService, message?: Message) {
    if (message) {
      this.message = message;
    }
    this.databaseService = databaseService;
  }

  private transformToRawMessage(message: Message): RawMessage {
    return {
      _id: message.id,
      chat_id: message.chatId,
      created_date: message.createdDate.toISOString(),
      chat_username: message.chatUsername,
      edited_date: message.editedDate == null ? null : message.editedDate.toISOString(),
      forward_count: message.forwardCount,
      message_id: message.messageId,
      text: message.text,
      updated_date: message.updatedDate.toISOString(),
      view_count: message.viewCount,
    };
  }

  async save(): Promise<void> {
    if (this.message == null) {
      return;
    }

    const rawMessage = this.transformToRawMessage(this.message);
    const { _id: id, ...rest } = rawMessage;
    await this.databaseService.ingestDocument(rest, this.DATABASE_INDEX, id);
  }

  async saveMany(messages: Message[]): Promise<void> {
    const rawMessages = messages.map((message) => this.transformToRawMessage(message));
    await this.databaseService.ingestDocuments(rawMessages, this.DATABASE_INDEX);
  }
}
