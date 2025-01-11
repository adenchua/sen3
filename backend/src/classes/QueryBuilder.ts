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
    const temp = {
      term: {
        [fieldName]: {
          value,
        },
      },
    };

    this.query!.query!.bool!.must!.push(temp);
  }

  addPagination(from: number, size: number): void {
    this.query.from = from;
    this.query.size = size;
  }
}
