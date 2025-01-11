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

  transformToRawDeck(deck: Deck): RawDeck {
    return {
      _id: deck.id,
      chat_ids: deck.chatIds,
      created_date: deck.createdDate.toISOString(),
      is_active: deck.isActive,
      keywords: deck.keywords,
      last_notification_date: deck.lastNotificationDate.toISOString(),
      subscriber_id: deck.subscriberId,
      title: deck.title,
    };
  }

  /** Creates a deck in the database */
  async save(): Promise<void> {
    if (this.deck == null) {
      return;
    }

    const rawDeck = this.transformToRawDeck(this.deck);
    const { _id: id, ...rest } = rawDeck;
    await this.databaseService.ingestDocument(rest, this.DATABASE_INDEX, id);
  }
}
