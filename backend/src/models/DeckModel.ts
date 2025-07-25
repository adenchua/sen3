import QueryBuilder from "../classes/QueryBuilder";
import { DatabaseIndex } from "../interfaces/common";
import { DatabaseDeck, DDeck, Deck } from "../interfaces/DeckInterface";
import DatabaseService from "../services/DatabaseService";

export class DeckModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: DatabaseIndex = "deck";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  transformToRawDeck(deck: Partial<Deck>): Partial<DatabaseDeck> {
    return {
      _id: deck.id,
      chat_ids: deck.chatIds,
      created_date: deck.createdDate?.toISOString(),
      deck_template_id: deck.deckTemplateId,
      is_active: deck.isActive,
      keywords: deck.keywords,
      last_notification_date: deck.lastNotificationDate?.toISOString(),
      subscriber_id: deck.subscriberId,
      title: deck.title,
      updated_date: deck.updatedDate?.toISOString(),
    };
  }

  transformToDeck(rawDeck: DatabaseDeck): Deck {
    return {
      chatIds: rawDeck.chat_ids,
      createdDate: new Date(rawDeck.created_date),
      deckTemplateId: rawDeck.deck_template_id,
      id: rawDeck._id,
      isActive: rawDeck.is_active,
      keywords: rawDeck.keywords,
      lastNotificationDate: new Date(rawDeck.last_notification_date),
      subscriberId: rawDeck.subscriber_id,
      title: rawDeck.title,
      updatedDate: new Date(rawDeck.updated_date),
    };
  }

  /** Creates a deck in the database */
  async save(
    deck: Omit<Deck, "id" | "updatedDate" | "createdDate" | "lastNotificationDate">,
  ): Promise<string> {
    const rawDeck = this.transformToRawDeck({
      ...deck,
      updatedDate: new Date(),
      createdDate: new Date(),
      lastNotificationDate: new Date(),
    });
    const documentId = await this.databaseService.ingestDocument(rawDeck, this.DATABASE_INDEX);
    return documentId;
  }

  async fetch(
    filters: { subscriberId?: string; isActive?: boolean },
    from = 0,
    size = 10,
  ): Promise<Deck[]> {
    const { subscriberId, isActive } = filters;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);
    if (subscriberId != undefined) {
      queryBuilder.addTermQuery("subscriber_id", subscriberId);
    }

    if (isActive != undefined) {
      queryBuilder.addTermQuery("is_active", isActive);
    }

    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments<DDeck>(this.DATABASE_INDEX, query);

    const result = response.map((rawDeck) => this.transformToDeck(rawDeck));

    return result;
  }

  async fetchOne(id: string): Promise<Deck | null> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(0, 1);
    queryBuilder.addTermQuery("_id", id);
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments<DDeck>(this.DATABASE_INDEX, query);

    if (response.length === 0) {
      return null;
    }

    const [result] = response.map((rawDeck) => this.transformToDeck(rawDeck));

    return result;
  }

  async update(deckId: string, updatedFields: Partial<Deck>) {
    const transformedUpdatedFields = this.transformToRawDeck({
      ...updatedFields,
      updatedDate: new Date(),
    });

    const response = await this.databaseService.updateDocument<DDeck>(
      this.DATABASE_INDEX,
      deckId,
      transformedUpdatedFields,
    );

    return response;
  }

  async syncDecksWithTemplate(deckTemplateId: string, deckFields: Partial<Deck>) {
    // only sync chat ids for now
    const { chatIds } = deckFields;

    await this.databaseService.scriptUpdateDocuments(
      this.DATABASE_INDEX,
      {
        term: {
          deck_template_id: { value: deckTemplateId },
        },
      },
      {
        source: "ctx._source.chat_ids = params.value",
        lang: "painless",
        params: {
          value: chatIds,
        },
      },
    );
  }

  async delete(deckId: string) {
    await this.databaseService.deleteDocument(this.DATABASE_INDEX, deckId);
  }
}
