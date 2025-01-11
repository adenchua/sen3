import QueryBuilder from "../classes/QueryBuilder";
import Deck from "../interfaces/DeckInterface";
import DatabaseService from "../services/DatabaseService";

/** database deck mapping */
interface RawDeck {
  _id?: string;
  subscriber_id: string;
  chat_ids: string[];
  created_date: string;
  is_active: boolean;
  keywords: string[];
  last_notification_date: string;
  title: string;
}

export class DeckModel {
  private deck: Deck | null = null;
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "deck";

  constructor(databaseService: DatabaseService, deck?: Deck) {
    if (deck) {
      this.deck = deck;
    }

    this.databaseService = databaseService;
  }

  transformToRawDeck(deck: Partial<Deck>): Partial<RawDeck> {
    return {
      _id: deck.id,
      chat_ids: deck.chatIds,
      created_date: deck.createdDate ? deck.createdDate.toISOString() : undefined,
      is_active: deck.isActive,
      keywords: deck.keywords,
      last_notification_date: deck.lastNotificationDate
        ? deck.lastNotificationDate.toISOString()
        : undefined,
      subscriber_id: deck.subscriberId,
      title: deck.title,
    };
  }

  transformToDeck(rawDeck: RawDeck): Deck {
    return {
      id: rawDeck._id,
      chatIds: rawDeck.chat_ids,
      createdDate: new Date(rawDeck.created_date),
      isActive: rawDeck.is_active,
      keywords: rawDeck.keywords,
      lastNotificationDate: new Date(rawDeck.last_notification_date),
      subscriberId: rawDeck.subscriber_id,
      title: rawDeck.title,
    };
  }

  /** Creates a deck in the database */
  async save(): Promise<string> {
    if (this.deck == null) {
      throw new Error("No deck instantiated");
    }

    const rawDeck = this.transformToRawDeck(this.deck);
    const documentId = await this.databaseService.ingestDocument(rawDeck, this.DATABASE_INDEX);
    return documentId;
  }

  async fetch(fields: { subscriberId?: string }, from = 0, size = 10): Promise<Deck[]> {
    const { subscriberId } = fields;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);
    if (subscriberId != undefined) {
      queryBuilder.addTermQuery<string>("subscriber_id", subscriberId);
    }

    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments<RawDeck>(this.DATABASE_INDEX, query);

    const result = response.map((rawDeck) => this.transformToDeck(rawDeck as unknown as RawDeck));

    return result;
  }

  async fetchOne(id: string): Promise<Deck> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(0, 1);
    queryBuilder.addTermQuery("_id", id);
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments<RawDeck>(this.DATABASE_INDEX, query);

    const [result] = response.map((rawDeck) => this.transformToDeck(rawDeck as unknown as RawDeck));

    return result;
  }

  async update(deckId: string, updatedFields: Partial<Deck>) {
    const transformedUpdatedFields = this.transformToRawDeck(updatedFields);

    const response = await this.databaseService.updateDocument<RawDeck>(
      this.DATABASE_INDEX,
      deckId,
      transformedUpdatedFields,
    );

    return response.body;
  }
}
