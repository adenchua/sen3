import { CalendarInterval } from "@opensearch-project/opensearch/api/_types/_common.aggregations";

import QueryBuilder from "../classes/QueryBuilder";
import { DatabaseIndex } from "../interfaces/common";
import { DatabaseMessage, DMessage, Message } from "../interfaces/MessageInterface";
import DatabaseService from "../services/DatabaseService";

type MessageDateFields = Extract<
  keyof DatabaseMessage,
  "created_date" | "edited_date" | "updated_date"
>;

export class MessageModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: DatabaseIndex = "message";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  private transformToRawMessage(message: Partial<Message>): Partial<DatabaseMessage> {
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

  private transformToMessage(rawMessage: DatabaseMessage): Message {
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
    await this.databaseService.ingestDocuments<DMessage>(
      rawMessages as DatabaseMessage[],
      this.DATABASE_INDEX,
    );
  }

  async fetch(
    filters: { keywords?: string[]; chatIds?: string[]; createdDateFrom?: string },
    from = 0,
    size = 10,
  ): Promise<Message[]> {
    const { keywords, chatIds, createdDateFrom } = filters;

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
    const response = await this.databaseService.fetchDocuments<DMessage>(
      this.DATABASE_INDEX,
      query,
    );

    const result = response.map((rawMessage) => this.transformToMessage(rawMessage));

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
