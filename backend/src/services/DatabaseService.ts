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

  async ping(): Promise<boolean> {
    return (await this.databaseClient.ping()).statusCode === 200;
  }

  async ingestDocument<T>(document: T, documentId: string, indexName: string) {
    const response = await this.databaseClient.index({
      body: document as object,
      id: documentId,
      index: indexName,
      refresh: true,
    });

    return response.body;
  }

  async fetchDocuments(indexName: string, query: opensearchtypes.SearchRequest["body"]) {
    const response = await this.databaseClient.search({
      index: indexName,
      body: query,
    });

    return response.body;
  }
}
