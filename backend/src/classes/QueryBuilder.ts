import { Search_RequestBody } from "@opensearch-project/opensearch/api";
import { FieldValue } from "@opensearch-project/opensearch/api/_types/_common";
import { QueryContainer } from "@opensearch-project/opensearch/api/_types/_common.query_dsl";

export default class QueryBuilder {
  private query = {
    from: 0,
    size: 10,
    query: {
      bool: { must: [] as QueryContainer[] },
    },
  };

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

  addRangeQuery(fieldName: string, operator: "gte" | "gt" | "lt" | "lte", value: string): void {
    const mustQuery: QueryContainer = {
      range: {
        [fieldName]: {
          [operator]: value,
        },
      },
    };

    this.query.query.bool.must.push(mustQuery);
  }

  addSimpleQueryStringQuery(fieldsToQuery: string[], queryStrings: string[]): void {
    // words in each array joined by the OR operator
    // for each query string, append double quote for phrase match since it may contain more than 1 word
    const validQueryString = queryStrings.map((queryString) => `"${queryString}"`).join(" | ");
    const mustQuery: QueryContainer = {
      simple_query_string: {
        fields: fieldsToQuery,
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
