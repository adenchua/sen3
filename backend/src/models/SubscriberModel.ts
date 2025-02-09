import Subscriber from "../interfaces/SubscriberInterface";
import DatabaseService from "../services/DatabaseService";
import QueryBuilder from "../classes/QueryBuilder";

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

  transformToRawSubscriber(subscriber: Partial<Subscriber>): Partial<RawSubscriber> {
    return {
      _id: subscriber.id,
      allow_notifications: subscriber.allowNotifications,
      first_name: subscriber.firstName,
      is_approved: subscriber.isApproved,
      registered_date: subscriber.registeredDate?.toISOString(),
      last_name: subscriber.lastName,
      username: subscriber.username,
    };
  }

  transformToSubscriber(rawSubscriber: RawSubscriber): Subscriber {
    return {
      id: rawSubscriber._id,
      allowNotifications: rawSubscriber.allow_notifications,
      firstName: rawSubscriber.first_name,
      isApproved: rawSubscriber.is_approved,
      registeredDate: new Date(rawSubscriber.registered_date),
      lastName: rawSubscriber.last_name,
      username: rawSubscriber.username,
    };
  }

  /** Creates a subscriber in the database */
  async save(): Promise<void> {
    if (this.subscriber == null) {
      return;
    }

    const rawSubscriber = this.transformToRawSubscriber(this.subscriber);
    const { _id: id, ...rest } = rawSubscriber;
    await this.databaseService.ingestDocument(rest, this.DATABASE_INDEX, id);
  }

  /** Fetches a subscriber by ID */
  async fetchOne(id: string): Promise<Subscriber> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(0, 1);
    queryBuilder.addTermQuery("_id", id);
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments(this.DATABASE_INDEX, query);

    const [result] = response.map((rawSubscriber) =>
      this.transformToSubscriber(rawSubscriber as unknown as RawSubscriber),
    );

    return result;
  }

  async fetch(
    fields: { isApproved?: boolean; allowNotifications?: boolean },
    from = 0,
    size = 10,
  ): Promise<Subscriber[]> {
    const { isApproved, allowNotifications } = fields;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);
    if (isApproved != undefined) {
      queryBuilder.addTermQuery("is_approved", isApproved);
    }
    if (allowNotifications != undefined) {
      queryBuilder.addTermQuery("allow_notifications", allowNotifications);
    }
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments<RawSubscriber>(
      this.DATABASE_INDEX,
      query,
    );

    const result = response.map((rawSubscriber) =>
      this.transformToSubscriber(rawSubscriber as unknown as RawSubscriber),
    );

    return result;
  }

  async update(subscriberId: string, updatedFields: Partial<Subscriber>) {
    const transformedUpdatedFields = this.transformToRawSubscriber(updatedFields);

    const response = await this.databaseService.updateDocument<RawSubscriber>(
      this.DATABASE_INDEX,
      subscriberId,
      transformedUpdatedFields,
    );

    return response;
  }
}
