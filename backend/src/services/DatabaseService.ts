import { Client, opensearchtypes } from "@opensearch-project/opensearch";

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
    searchResponse: opensearchtypes.SearchResponse<T>,
  ): Array<{ _id: string & T }> {
    const result = searchResponse.hits.hits.map((hit) => {
      return {
        _id: hit._id,
        ...hit._source,
      };
    });

    return result as Array<{ _id: string & T }>;
  }

  async ping(): Promise<boolean> {
    return (await this.databaseClient.ping()).statusCode === 200;
  }

  async ingestDocument<T>(document: T, indexName: string, documentId?: string) {
    const response = await this.databaseClient.index({
      body: document as object,
      id: documentId,
      index: indexName,
      refresh: true,
    });

    return response.body;
  }

  /** bulk ingest documents. Each document must contain a unique _id field */
  async ingestDocuments<T extends { _id: string }>(
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
    query: opensearchtypes.SearchRequest["body"],
  ): Promise<Array<{ _id: string & T }>> {
    const response = await this.databaseClient.search<opensearchtypes.SearchResponse<T>>({
      index: indexName,
      body: query,
    });

    return this.processHitsResponse(response.body);
  }

  async updateDocument<T>(indexName: string, documentId: string, updatedFields: Partial<T>) {
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
