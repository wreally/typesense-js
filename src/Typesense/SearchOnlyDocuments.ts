import RequestWithCache from "./RequestWithCache";
import ApiCall from "./ApiCall";
import Configuration from "./Configuration";
import Collections from "./Collections";
import type {
  DocumentSchema,
  SearchableDocuments,
  SearchOptions,
  SearchParams,
  SearchParamsWithPreset,
  SearchResponse,
} from "./Documents";
import { combineAndFlattenArraySearchParams } from "./Utils";

const RESOURCEPATH = "/documents";

export class SearchOnlyDocuments<T extends DocumentSchema>
  implements SearchableDocuments<T>
{
  protected requestWithCache: RequestWithCache = new RequestWithCache();

  constructor(
    protected collectionName: string,
    protected apiCall: ApiCall,
    protected configuration: Configuration
  ) {}

  clearCache() {
    this.requestWithCache.clearCache();
  }

  async search(
    searchParameters: SearchParams | SearchParamsWithPreset,
    {
      cacheSearchResultsForSeconds = this.configuration
        .cacheSearchResultsForSeconds,
      abortSignal = null,
    }: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    const additionalQueryParams = {};
    if (this.configuration.useServerSideSearchCache === true) {
      additionalQueryParams["use_cache"] = true;
    }

    const joinedSearchParams =
      combineAndFlattenArraySearchParams(searchParameters);

    const queryParams = Object.assign(
      {},
      joinedSearchParams,
      additionalQueryParams,
    );

    return this.requestWithCache.perform(
      this.apiCall,
      this.apiCall.get,
      [this.endpointPath("search"), queryParams, { abortSignal }],
      {
        cacheResponseForSeconds: cacheSearchResultsForSeconds,
      }
    ) as Promise<SearchResponse<T>>;
  }

  protected endpointPath(operation?: string) {
    return `${Collections.RESOURCEPATH}/${this.collectionName}${RESOURCEPATH}${
      operation === undefined ? "" : "/" + operation
    }`;
  }

  static get RESOURCEPATH() {
    return RESOURCEPATH;
  }
}
