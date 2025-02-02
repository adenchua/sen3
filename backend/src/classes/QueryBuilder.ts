import { opensearchtypes } from "@opensearch-project/opensearch";
import { QueryDslQueryContainer } from "@opensearch-project/opensearch/api/types";

export default class QueryBuilder {
  private query = {
    from: 0,
    size: 10,
    query: {
      bool: { must: [] as QueryDslQueryContainer[] },
    },
  } satisfies opensearchtypes.SearchRequest["body"];

  constructor() {}

  getQuery(): opensearchtypes.SearchRequest["body"] {
    return this.query;
  }

  addTermQuery<T>(fieldName: string, value: T): void {
    const mustQuery = {
      term: {
        [fieldName]: {
          value,
        },
      },
    };

    this.query.query.bool.must.push(mustQuery);
  }

  addTermsQuery<T>(fieldName: string, values: T[]): void {
    const mustQuery = {
      terms: {
        [fieldName]: values,
      },
    };

    this.query.query.bool.must.push(mustQuery);
  }

  addRangeQuery(
    fieldName: string,
    operator: opensearchtypes.QueryDslRangeQuery,
    value: string,
  ): void {
    const mustQuery = {
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
    const mustQuery = {
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
