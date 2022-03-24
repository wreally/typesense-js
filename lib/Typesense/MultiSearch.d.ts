import type ApiCall from './ApiCall';
import type Configuration from './Configuration';
import type { DocumentSchema, SearchParams, SearchResponse } from './Documents';
export interface MultiSearchRequestSchema extends SearchParams {
    collection?: string;
}
export interface MultiSearchRequestsSchema {
    searches: MultiSearchRequestSchema[];
}
export interface MultiSearchResponse<T> {
    results: SearchResponse<T>[];
}
export default class MultiSearch<T extends DocumentSchema = {}> {
    private apiCall;
    private configuration;
    private useTextContentType;
    private requestWithCache;
    constructor(apiCall: ApiCall, configuration: Configuration, useTextContentType?: boolean);
    perform(searchRequests: MultiSearchRequestsSchema, commonParams?: Partial<MultiSearchRequestSchema>, { cacheSearchResultsForSeconds }?: {
        cacheSearchResultsForSeconds?: number;
    }): Promise<MultiSearchResponse<T>>;
}
