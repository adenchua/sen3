import { CalendarInterval } from "@opensearch-project/opensearch/api/_types/_common.aggregations";

import { DatabaseIndex } from "../interfaces/common";
import { DatabaseNotification, Notification } from "../interfaces/NotificationInterface";
import DatabaseService from "../services/DatabaseService";

type NotificationDateFields = Extract<keyof DatabaseNotification, "notification_date">;

export class NotificationModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: DatabaseIndex = "notification";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  transformToRawNotification(notification: Partial<Notification>): Partial<DatabaseNotification> {
    return {
      chat_id: notification.chatId,
      keywords: notification.keywords,
      message: notification.message,
      notification_date: notification.notificationDate?.toISOString(),
      subscriber_id: notification.subscriberId,
    };
  }

  async save(notification: Omit<Notification, "id">): Promise<void> {
    const rawNotification = this.transformToRawNotification(notification);
    await this.databaseService.ingestDocument(rawNotification, this.DATABASE_INDEX);
  }

  async getCount(
    field: NotificationDateFields,
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

  async getDateHistogram(field: NotificationDateFields, interval: CalendarInterval) {
    const result = await this.databaseService.fetchDateHistogram(
      this.DATABASE_INDEX,
      field,
      interval,
    );

    return result;
  }
}
