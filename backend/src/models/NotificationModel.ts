import Notification from "../interfaces/NotificationInterface";
import DatabaseService from "../services/DatabaseService";

/** database notification mapping */
interface DatabaseNotification {
  _id: string;
  chat_id: string;
  keywords: string[];
  message: string;
  notification_date: string;
  subscriber_id: string;
}

export class NotificationModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "notification";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  transformToDatabaseNotification(
    notification: Partial<Notification>,
  ): Partial<DatabaseNotification> {
    return {
      chat_id: notification.chatId,
      keywords: notification.keywords,
      message: notification.message,
      notification_date: notification.notificationDate?.toISOString(),
      subscriber_id: notification.subscriberId,
    };
  }

  /** Creates a notification document in the database */
  async save(notification: Notification): Promise<void> {
    const databaseNotification = this.transformToDatabaseNotification(notification);
    await this.databaseService.ingestDocument(databaseNotification, this.DATABASE_INDEX);
  }
}
