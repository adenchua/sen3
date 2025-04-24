import { CalendarInterval } from "@opensearch-project/opensearch/api/_types/_common.aggregations";

import QueryBuilder from "../classes/QueryBuilder";
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

type MessageDateFields = Extract<keyof RawMessage, "created_date" | "edited_date" | "updated_date">;

export class MessageModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "message";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  private transformToRawMessage(message: Partial<Message>): Partial<RawMessage> {
    return {
      _id: message.id,
      chat_id: message.chatId,
      created_date: message.createdDate?.toISOString(),
      chat_username: message.chatUsername,
      edited_date: message.editedDate?.toISOString(),
      forward_count: message.forwardCount,
      message_id: message.messageId,
      text: message.text,
      updated_date: message.updatedDate?.toISOString(),
      view_count: message.viewCount,
    };
  }

  private transformToMessage(rawMessage: RawMessage): Message {
    return {
      id: rawMessage._id,
      chatId: rawMessage.chat_id,
      chatUsername: rawMessage.chat_username,
      createdDate: new Date(rawMessage.created_date),
      editedDate: rawMessage.edited_date ? new Date(rawMessage.edited_date) : null,
      forwardCount: rawMessage.forward_count,
      messageId: rawMessage.message_id,
      text: rawMessage.text,
      updatedDate: new Date(rawMessage.updated_date),
      viewCount: rawMessage.view_count,
    };
  }

  async save(message: Message): Promise<void> {
    const rawMessage = this.transformToRawMessage(message);
    const { _id: id, ...rest } = rawMessage;
    await this.databaseService.ingestDocument(rest, this.DATABASE_INDEX, id);
  }

  async saveMany(messages: Message[]): Promise<void> {
    const rawMessages = messages.map((message) => this.transformToRawMessage(message));
    await this.databaseService.ingestDocuments(
      rawMessages as unknown as RawMessage[],
      this.DATABASE_INDEX,
    );
  }

  async fetch(
    fields: { keywords?: string[]; chatIds?: string[]; createdDateFrom?: string },
    from = 0,
    size = 10,
  ): Promise<Message[]> {
    const { keywords, chatIds, createdDateFrom } = fields;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);

    if (keywords != undefined) {
      queryBuilder.addSimpleQueryStringQuery(["text"], keywords);
    }

    if (chatIds != undefined) {
      queryBuilder.addTermsQuery("chat_id", chatIds);
    }

    if (createdDateFrom != undefined) {
      queryBuilder.addRangeQuery("created_date", "gte", createdDateFrom);
    }

    const query = queryBuilder.getQuery();
    const response = await this.databaseService.fetchDocuments<RawMessage>(
      this.DATABASE_INDEX,
      query,
    );

    const result = response.map((rawChat) =>
      this.transformToMessage(rawChat as unknown as RawMessage),
    );

    return result;
  }

  async getCount(
    field: MessageDateFields,
    dateFromISOString: string,
    dateToISOString: string,
  ): Promise<number> {
    const query = {
      query: {
        range: {
          [field]: {
            gte: dateFromISOString,
            lte: dateToISOString,
          },
        },
      },
    };

    const result = await this.databaseService.fetchCount(this.DATABASE_INDEX, query);

    return result;
  }

  async getDateHistogram(field: MessageDateFields, interval: CalendarInterval) {
    const result = await this.databaseService.fetchDateHistogram(
      this.DATABASE_INDEX,
      field,
      interval,
    );

    return result;
  }
}
