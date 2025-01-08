import Subscriber from "../interfaces/SubscriberInterface";
import DatabaseService from "../services/DatabaseService";

/** database subscriber mapping */
interface RawSubscriber {
  _id: string;
  allow_notifications: boolean;
  first_name: string;
  is_approved: boolean;
  last_name?: string;
  registered_date: string;
  username?: string;
}

export class SubscriberModel {
  private subscriber: Subscriber | null = null;
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "subscriber";

  constructor(databaseService: DatabaseService, subscriber?: Subscriber) {
    if (subscriber) {
      this.subscriber = subscriber;
    }
    this.databaseService = databaseService;
  }

  transformToRawSubscriber(subscriber: Subscriber): RawSubscriber {
    return {
      _id: subscriber.id,
      allow_notifications: subscriber.allowNotifications,
      first_name: subscriber.firstName,
      is_approved: subscriber.isApproved,
      registered_date: subscriber.registeredDate.toISOString(),
      last_name: subscriber.lastName,
      username: subscriber.username,
    };
  }

  /** Creates a subscriber in the database */
  async save(): Promise<void> {
    if (this.subscriber == null) {
      return;
    }

    const rawSubscriber = this.transformToRawSubscriber(this.subscriber);
    const { _id: id, ...rest } = rawSubscriber;
    await this.databaseService.ingestDocument(rest, id!, this.DATABASE_INDEX);
  }
}
