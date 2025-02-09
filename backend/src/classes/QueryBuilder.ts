import { Search_RequestBody } from "@opensearch-project/opensearch/api";
import { FieldValue } from "@opensearch-project/opensearch/api/_types/_common";
import {
  DateRangeQuery,
  QueryContainer,
} from "@opensearch-project/opensearch/api/_types/_common.query_dsl";

export default class QueryBuilder {
  private query = {
    from: 0,
    size: 10,
    query: {
      bool: { must: [] as QueryContainer[] },
    },
  } satisfies Search_RequestBody;

  getQuery(): Search_RequestBody {
    return this.query;
  }

  addTermQuery(fieldName: string, value: FieldValue): void {
    const mustQuery: QueryContainer = {
      term: {
        [fieldName]: {
          value,
        },
      },
    };

    this.query.query.bool.must.push(mustQuery);
  }

  addTermsQuery(fieldName: string, values: FieldValue[]): void {
    const mustQuery: QueryContainer = {
      terms: {
        [fieldName]: values,
      },
    };

    this.query.query.bool.must.push(mustQuery);
  }

  addRangeQuery(fieldName: string, operator: DateRangeQuery, value: string): void {
    const mustQuery: QueryContainer = {
      range: {
        [fieldName]: {
          [operator as string]: value,
        },
      },
    };

    this.query.query.bool.must.push(mustQuery);
  }

  addSimpleQueryStringQuery(fields: string[], queryStrings: string[]): void {
    // words in each array joined by the OR operator
    const validQueryString = queryStrings.join(" | ");
    const mustQuery: QueryContainer = {
      simple_query_string: {
        fields,
        query: validQueryString,
      },
    };

    this.query.query.bool.must.push(mustQuery);
  }

  addPagination(from: number, size: number): void {
    this.query.from = from;
    this.query.size = size;
  }
}
