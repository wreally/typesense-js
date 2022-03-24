import RequestWithCache from './RequestWithCache'
import type ApiCall from './ApiCall'
import type Configuration from './Configuration'
import Collections from './Collections'
import type { SearchableDocuments, SearchOptions, SearchParams, SearchResponse } from './Documents'

const RESOURCEPATH = '/documents'

export class SearchOnlyDocuments<T> implements SearchableDocuments<T> {
  protected requestWithCache: RequestWithCache = new RequestWithCache()

  constructor (protected collectionName: string, protected apiCall: ApiCall, protected configuration: Configuration) {}

  async search (
    searchParameters: SearchParams,
    {
      cacheSearchResultsForSeconds = this.configuration.cacheSearchResultsForSeconds,
      abortSignal = null
    }: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    const additionalQueryParams = {}
    if (this.configuration.useServerSideSearchCache === true) {
      additionalQueryParams['use_cache'] = true
    }
    const queryParams = Object.assign({}, searchParameters, additionalQueryParams)

    return this.requestWithCache.perform(
      this.apiCall,
      this.apiCall.get,
      [this.endpointPath('search'), queryParams, { abortSignal }],
      {
        cacheResponseForSeconds: cacheSearchResultsForSeconds
      }
    )
  }

  protected endpointPath (operation?: string) {
    return `${Collections.RESOURCEPATH}/${this.collectionName}${RESOURCEPATH}${
      operation === undefined ? '' : '/' + operation
    }`
  }

  static get RESOURCEPATH () {
    return RESOURCEPATH
  }
}
