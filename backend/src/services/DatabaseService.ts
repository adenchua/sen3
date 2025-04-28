import { Client } from "@opensearch-project/opensearch";
import {
  Count_RequestBody,
  Search_RequestBody,
  Search_ResponseBody,
  Update_ResponseBody,
} from "@opensearch-project/opensearch/api";

import {
  CalendarInterval,
  DateHistogramBucket,
} from "@opensearch-project/opensearch/api/_types/_common.aggregations";
import { ErrorResponse } from "../errors/ErrorResponse";
import { DateHistogramResponse } from "../interfaces/ResponseInterface";

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
    try {
      const response = await this.databaseClient.index({
        body: document as object,
        id: documentId,
        index: indexName,
        refresh: true,
      });

      return response.body._id;
    } catch (error) {
      console.error(error);
      throw new ErrorResponse();
    }
  }

  /** bulk ingest documents. Each document must contain a unique _id field */
  async ingestDocuments<T extends DatabaseDocumentId>(
    documents: Array<T>,
    indexName: string,
  ): Promise<number> {
    try {
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
    } catch (error) {
      console.error(error);
      throw new ErrorResponse();
    }
  }

  async fetchDocuments<T>(
    indexName: string,
    query: Search_RequestBody,
  ): Promise<Array<DatabaseDocumentId & T>> {
    try {
      const response = await this.databaseClient.search({
        index: indexName,
        body: query,
      });

      return this.processHitsResponse(response.body);
    } catch (error) {
      console.error(error);
      throw new ErrorResponse();
    }
  }

  async updateDocument<T>(
    indexName: string,
    documentId: string,
    updatedFields: Partial<T>,
  ): Promise<Update_ResponseBody> {
    try {
      const response = await this.databaseClient.update({
        index: indexName,
        id: documentId,
        body: {
          doc: updatedFields,
        },
        refresh: true,
      });

      return response.body;
    } catch (error) {
      console.error(error);
      throw new ErrorResponse();
    }
  }

  async fetchCount(indexName: string, query: Count_RequestBody): Promise<number> {
    try {
      const response = await this.databaseClient.count({
        index: indexName,
        body: query,
      });

      return response.body.count;
    } catch (error) {
      console.error(error);
      throw new ErrorResponse();
    }
  }

  async fetchDateHistogram(
    indexName: string,
    field: string,
    interval: CalendarInterval,
  ): Promise<DateHistogramResponse> {
    try {
      const response = await this.databaseClient.search({
        index: indexName,
        body: {
          size: 0,
          aggs: {
            date_histogram: {
              date_histogram: {
                field,
                interval,
              },
            },
          },
        },
      });

      const aggregationResult = response.body.aggregations;

      if (aggregationResult != undefined && "buckets" in aggregationResult.date_histogram) {
        const dateHistogramBuckets = aggregationResult.date_histogram
          .buckets as DateHistogramBucket[];
        const parsedBuckets = dateHistogramBuckets.map((dateHisogramBucket) => {
          return {
            dateISOString: dateHisogramBucket.key_as_string!,
            count: dateHisogramBucket.doc_count,
          };
        });
        return parsedBuckets;
      }

      // shouldnt reach this block but send an empty array for compilation
      return [];
    } catch (error) {
      console.error(error);
      throw new ErrorResponse();
    }
  }
}
