import { Client } from "@opensearch-project/opensearch";
import {
  Search_RequestBody,
  Search_ResponseBody,
  Update_ResponseBody,
} from "@opensearch-project/opensearch/api";

interface DatabaseDocumentId {
  _id: string;
}

export default class DatabaseService {
  private databaseClient: Client;

  constructor(databaseURL: string, username: string, password: string) {
    const client = new Client({
      node: databaseURL,
      auth: {
        username,
        password,
      },
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.databaseClient = client;
  }

  private processHitsResponse<T>(
    searchResponse: Search_ResponseBody,
  ): Array<DatabaseDocumentId & T> {
    const result = searchResponse.hits.hits.map((hit) => {
      return {
        _id: hit._id,
        ...(hit._source as T),
      };
    });

    return result;
  }

  async ping(): Promise<boolean> {
    return (await this.databaseClient.ping()).statusCode === 200;
  }

  async ingestDocument<T>(document: T, indexName: string, documentId?: string): Promise<string> {
    const response = await this.databaseClient.index({
      body: document as object,
      id: documentId,
      index: indexName,
      refresh: true,
    });

    return response.body._id;
  }

  /** bulk ingest documents. Each document must contain a unique _id field */
  async ingestDocuments<T extends DatabaseDocumentId>(
    documents: Array<T>,
    indexName: string,
  ): Promise<number> {
    const response = await this.databaseClient.helpers.bulk({
      datasource: documents,
      refresh: true,
      onDocument(document) {
        const { _id, ...rest } = document;

        return [
          {
            index: { _index: indexName, _id },
          },
          rest,
        ];
      },
    });

    return response.successful;
  }

  async fetchDocuments<T>(
    indexName: string,
    query: Search_RequestBody,
  ): Promise<Array<DatabaseDocumentId & T>> {
    const response = await this.databaseClient.search({
      index: indexName,
      body: query,
    });

    return this.processHitsResponse(response.body);
  }

  async updateDocument<T>(
    indexName: string,
    documentId: string,
    updatedFields: Partial<T>,
  ): Promise<Update_ResponseBody> {
    const response = await this.databaseClient.update({
      index: indexName,
      id: documentId,
      body: {
        doc: updatedFields,
      },
      refresh: true,
    });

    return response.body;
  }
}
