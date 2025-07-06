import QueryBuilder from "../classes/QueryBuilder";
import { DatabaseIndex } from "../interfaces/common";
import {
  DatabaseDeckTemplate,
  DDeckTemplate,
  DeckTemplate,
} from "../interfaces/DeckTemplateInterface";
import DatabaseService from "../services/DatabaseService";

export class DeckTemplateModel {
  private databaseService: DatabaseService;
  private DATABASE_INDEX: DatabaseIndex = "deck-template";

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  private transformToRawDeckTemplate(
    deckTemplate: Partial<DeckTemplate>,
  ): Partial<DatabaseDeckTemplate> {
    return {
      chat_ids: deckTemplate.chatIds,
      created_date: deckTemplate.createdDate?.toISOString(),
      is_default: deckTemplate.isDefault,
      is_deleted: deckTemplate.isDeleted,
      title: deckTemplate.title,
      updated_date: deckTemplate.updatedDate?.toISOString(),
    };
  }

  private transformToDeckTemplate(rawDeckTemplate: DatabaseDeckTemplate): DeckTemplate {
    return {
      id: rawDeckTemplate._id,
      chatIds: rawDeckTemplate.chat_ids,
      createdDate: new Date(rawDeckTemplate.created_date),
      isDeleted: rawDeckTemplate.is_deleted,
      isDefault: rawDeckTemplate.is_default,
      title: rawDeckTemplate.title,
      updatedDate: new Date(rawDeckTemplate.updated_date),
    };
  }

  async save(
    deckTemplate: Omit<DeckTemplate, "id" | "createdDate" | "updatedDate">,
  ): Promise<void> {
    const rawDeckTemplate = this.transformToRawDeckTemplate({
      ...deckTemplate,
      createdDate: new Date(),
      updatedDate: new Date(),
    });
    await this.databaseService.ingestDocument(rawDeckTemplate, this.DATABASE_INDEX);
  }

  async fetch(
    filters: { isDefault?: boolean; isDeleted?: boolean },
    from = 0,
    size = 10,
  ): Promise<DeckTemplate[]> {
    const { isDefault, isDeleted } = filters;

    const queryBuilder = new QueryBuilder();
    queryBuilder.addPagination(from, size);

    if (isDefault != undefined) {
      queryBuilder.addTermQuery("is_default", isDefault);
    }

    if (isDeleted != undefined) {
      queryBuilder.addTermQuery("is_deleted", isDeleted);
    }

    const query = queryBuilder.getQuery();
    const response = await this.databaseService.fetchDocuments<DDeckTemplate>(
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

    const response = await this.databaseService.fetchDocuments<DDeckTemplate>(
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
    const transformedUpdatedFields = this.transformToRawDeckTemplate({
      ...updatedFields,
      updatedDate: new Date(),
    });

    const response = await this.databaseService.updateDocument<DeckTemplate>(
      this.DATABASE_INDEX,
      deckTemplateId,
      transformedUpdatedFields,
    );

    return response;
  }
}
