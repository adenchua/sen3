import Subscriber from "../interfaces/SubscriberInterface";
import DatabaseService from "../services/DatabaseService";
import QueryBuilder from "../classes/QueryBuilder";

/** database subscriber mapping */
interface DatabaseSubscriber {
  _id: string;
  allow_notifications: boolean;
  first_name: string;
  is_approved: boolean;
  last_name?: string;
  registered_date: string;
  username?: string;
}

export class SubscriberModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "subscriber";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  transformToRawSubscriber(subscriber: Partial<Subscriber>): Partial<DatabaseSubscriber> {
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

  transformToSubscriber(rawSubscriber: DatabaseSubscriber): Subscriber {
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
  async save(subscriber: Subscriber): Promise<string> {
    const rawSubscriber = this.transformToRawSubscriber(subscriber);
    const { _id: id, ...rest } = rawSubscriber;
    const response = await this.databaseService.ingestDocument(rest, this.DATABASE_INDEX, id);
    return response;
  }

  /** Fetches a subscriber by ID */
  async fetchOne(id: string): Promise<Subscriber | null> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(0, 1);
    queryBuilder.addTermQuery("_id", id);
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments(this.DATABASE_INDEX, query);

    if (response.length === 0) {
      return null;
    }

    const [result] = response.map((rawSubscriber) =>
      this.transformToSubscriber(rawSubscriber as unknown as DatabaseSubscriber),
    );

    return result;
  }

  async fetch(
    filters: { isApproved?: boolean; allowNotifications?: boolean },
    from = 0,
    size = 10,
  ): Promise<Subscriber[]> {
    const { isApproved, allowNotifications } = filters;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);
    if (isApproved != undefined) {
      queryBuilder.addTermQuery("is_approved", isApproved);
    }
    if (allowNotifications != undefined) {
      queryBuilder.addTermQuery("allow_notifications", allowNotifications);
    }
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments<DatabaseSubscriber>(
      this.DATABASE_INDEX,
      query,
    );

    const result = response.map((rawSubscriber) => this.transformToSubscriber(rawSubscriber));

    return result;
  }

  async update(subscriberId: string, updatedFields: Partial<Subscriber>) {
    const transformedUpdatedFields = this.transformToRawSubscriber(updatedFields);

    const response = await this.databaseService.updateDocument<DatabaseSubscriber>(
      this.DATABASE_INDEX,
      subscriberId,
      transformedUpdatedFields,
    );

    return response;
  }

  async delete(subscriberId: string) {
    await this.databaseService.deleteDocument(this.DATABASE_INDEX, subscriberId);
  }
}
