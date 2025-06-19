import QueryBuilder from "../classes/QueryBuilder";
import DeckTemplate from "../interfaces/DeckTemplateInterface";
import DatabaseService from "../services/DatabaseService";

interface RawDeckTemplate {
  _id: string;
  chat_ids: string[];
  created_date: string;
  is_default: boolean;
  title: string;
}

export class DeckTemplateModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: string = "deck-template";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  private transformToRawDeckTemplate(
    deckTemplate: Partial<DeckTemplate>,
  ): Partial<RawDeckTemplate> {
    return {
      chat_ids: deckTemplate.chatIds,
      created_date: deckTemplate.createdDate?.toISOString(),
      is_default: deckTemplate.isDefault,
      title: deckTemplate.title,
    };
  }

  private transformToDeckTemplate(rawDeckTemplate: RawDeckTemplate): DeckTemplate {
    return {
      id: rawDeckTemplate._id,
      chatIds: rawDeckTemplate.chat_ids,
      createdDate: new Date(rawDeckTemplate.created_date),
      isDefault: rawDeckTemplate.is_default,
      title: rawDeckTemplate.title,
    };
  }

  async save(deckTemplate: Omit<DeckTemplate, "id">): Promise<void> {
    const rawDeckTemplate = this.transformToRawDeckTemplate(deckTemplate);
    await this.databaseService.ingestDocument(rawDeckTemplate, this.DATABASE_INDEX);
  }

  async fetch(filters: { isDefault?: boolean }, from = 0, size = 10): Promise<DeckTemplate[]> {
    const { isDefault } = filters;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);

    if (isDefault != undefined) {
      queryBuilder.addTermQuery("is_default", isDefault);
    }

    const query = queryBuilder.getQuery();
    const response = await this.databaseService.fetchDocuments<RawDeckTemplate>(
      this.DATABASE_INDEX,
      query,
    );

    const result = response.map((rawDeckTemplate) => this.transformToDeckTemplate(rawDeckTemplate));

    return result;
  }

  async fetchOne(id: string): Promise<DeckTemplate | null> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(0, 1);
    queryBuilder.addTermQuery("_id", id);
    const query = queryBuilder.getQuery();

    const response = await this.databaseService.fetchDocuments<RawDeckTemplate>(
      this.DATABASE_INDEX,
      query,
    );

    if (response.length === 0) {
      return null;
    }

    const [result] = response.map((rawDeckTemplate) =>
      this.transformToDeckTemplate(rawDeckTemplate),
    );

    return result;
  }

  async update(deckTemplateId: string, updatedFields: Partial<DeckTemplate>) {
    const transformedUpdatedFields = this.transformToRawDeckTemplate(updatedFields);

    const response = await this.databaseService.updateDocument<DeckTemplate>(
      this.DATABASE_INDEX,
      deckTemplateId,
      transformedUpdatedFields,
    );

    return response;
  }
}
