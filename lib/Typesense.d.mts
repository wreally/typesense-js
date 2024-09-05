import { Agent } from 'http';
import { Agent as Agent$1 } from 'https';
import { AxiosRequestConfig, Method, AxiosResponse } from 'axios';
import { ReadStream } from 'fs';

/**
 * Represents the log levels that can be used in the logger with their corresponding number values.
 */
type LogLevelMap = {
    Trace: "trace" | 0;
    Debug: "debug" | 1;
    Info: "info" | 2;
    Warn: "warn" | 3;
    Error: "error" | 4;
    Silent: "silent" | 5;
};
/**
 * Represents the log levels that can be used in the logger.
 */
type LogLevel = LogLevelMap[keyof LogLevelMap];
/**
 * A simple logging class using a singleton pattern.
 * Only prints to stdout.
 */
declare class SimpleLogger {
    private static instance;
    /**
     * Numeric representation of the log level set.
     * Defaults to LogLevelNumber.Warn.
     * @private
     * @type {LogLevelNumberValues}
     */
    private logLevel;
    /**
     * Private constructor to prevent instantiation.
     * @private
     */
    private constructor();
    /**
     * Get the singleton instance of the SimpleLogger.
     * @returns {SimpleLogger} The singleton instance of the SimpleLogger.
     */
    static getInstance(): SimpleLogger;
    /**
     * Formats the message to be logged.
     * @private
     * @param level The log level to be used.
     * @param message The message to be logged.
     * @returns The formatted message.
     */
    private formatMessage;
    /**
     * Logs the message with the appropriate console function
     * @param level The log level to be used.
     * @param message The message to be logged.
     */
    private logWith;
    /**
     * Maps the log level to the appropriate console function.
     * @param level The log level to be used.
     * @returns The console function to be used for the log level.
     */
    private mapLogLevelToConsoleFunction;
    /**
     * Uses the `console.debug` method to log the message if the log level is set to debug or lower.
     * @param message The message to be logged.
     */
    debug(message: string): void;
    /**
     * Uses the `console.warn` method to log the message if the log level is set to warn or lower.
     * @param message The message to be logged.
     */
    warn(message: string): void;
    /**
     * Uses the `console.error` method to log the message if the log level is set to error or lower.
     * @param message The message to be logged.
     */
    error(message: string): void;
    /**
     * Uses the `console.trace` method to log the message if the log level is set to trace or lower.
     * @param message The message to be logged.
     */
    trace(message: string): void;
    /**
     * Uses the `console.info` method to log the message if the log level is set to info or lower.
     * @param message The message to be logged.
     */
    info(message: string): void;
    /**
     * Sets the log level to the specified level as a numeric representation of it, if given a string.
     * @param level The log level to be set.
     */
    setLogLevel(level: LogLevel): void;
}
declare const logger: SimpleLogger;

interface NodeConfiguration {
    host: string;
    port: number;
    protocol: string;
    path?: string;
    url?: string;
}
interface NodeConfigurationWithHostname {
    host: string;
    port: number;
    protocol: string;
    path?: string;
}
interface NodeConfigurationWithUrl {
    url: string;
}
interface ConfigurationOptions {
    apiKey: string;
    nodes: NodeConfiguration[] | NodeConfigurationWithHostname[] | NodeConfigurationWithUrl[];
    randomizeNodes?: boolean;
    /**
     * @deprecated
     * masterNode is now consolidated to nodes, starting with Typesense Server v0.12'
     */
    masterNode?: NodeConfiguration | NodeConfigurationWithHostname | NodeConfigurationWithUrl;
    /**
     * @deprecated
     * readReplicaNodes is now consolidated to nodes, starting with Typesense Server v0.12'
     */
    readReplicaNodes?: NodeConfiguration[] | NodeConfigurationWithHostname[] | NodeConfigurationWithUrl[];
    nearestNode?: NodeConfiguration | NodeConfigurationWithHostname | NodeConfigurationWithUrl;
    connectionTimeoutSeconds?: number;
    timeoutSeconds?: number;
    healthcheckIntervalSeconds?: number;
    numRetries?: number;
    retryIntervalSeconds?: number;
    sendApiKeyAsQueryParam?: boolean | undefined;
    useServerSideSearchCache?: boolean;
    cacheSearchResultsForSeconds?: number;
    additionalHeaders?: Record<string, string>;
    logger?: typeof logger;
    logLevel?: LogLevel;
    /**
     * Set a custom HTTP Agent
     *
     * This is helpful for eg, to enable keepAlive which helps prevents ECONNRESET socket hang up errors
     *    Usage:
     *      const { Agent: HTTPAgent } = require("http");
     *      ...
     *      httpAgent: new HTTPAgent({ keepAlive: true }),
     * @type {HTTPAgent}
     */
    httpAgent?: Agent;
    /**
     * Set a custom HTTPS Agent
     *
     * This is helpful for eg, to enable keepAlive which helps prevents ECONNRESET socket hang up errors
     *    Usage:
     *      const { Agent: HTTPSAgent } = require("https");
     *      ...
     *      httpsAgent: new HTTPSAgent({ keepAlive: true }),
     * @type {HTTPSAgent}
     */
    httpsAgent?: Agent$1;
    /**
     * Set a custom paramsSerializer
     *
     * See axios documentation for more information on how to use this parameter: https://axios-http.com/docs/req_config
     *  This is helpful for handling React Native issues like this: https://github.com/axios/axios/issues/6102#issuecomment-2085301397
     * @type {any}
     */
    paramsSerializer?: any;
}
declare class Configuration {
    readonly nodes: NodeConfiguration[] | NodeConfigurationWithHostname[] | NodeConfigurationWithUrl[];
    readonly nearestNode?: NodeConfiguration | NodeConfigurationWithHostname | NodeConfigurationWithUrl;
    readonly connectionTimeoutSeconds: number;
    readonly healthcheckIntervalSeconds: number;
    readonly numRetries: number;
    readonly retryIntervalSeconds: number;
    readonly apiKey: string;
    readonly sendApiKeyAsQueryParam?: boolean;
    readonly cacheSearchResultsForSeconds: number;
    readonly useServerSideSearchCache: boolean;
    readonly logger: typeof logger;
    readonly logLevel: LogLevel;
    readonly additionalHeaders?: Record<string, string>;
    readonly httpAgent?: Agent;
    readonly httpsAgent?: Agent$1;
    readonly paramsSerializer?: any;
    constructor(options: ConfigurationOptions);
    validate(): boolean;
    private validateNodes;
    private isNodeMissingAnyParameters;
    private setDefaultPathInNode;
    private setDefaultPortInNode;
    private showDeprecationWarnings;
    private shuffleArray;
}

declare class TypesenseError extends Error {
    httpStatus?: number;
    constructor(message?: string);
}

interface Node extends NodeConfiguration {
    isHealthy: boolean;
    index: string | number;
}
declare class ApiCall {
    private configuration;
    private readonly apiKey;
    private readonly nodes;
    private readonly nearestNode;
    private readonly connectionTimeoutSeconds;
    private readonly healthcheckIntervalSeconds;
    private readonly retryIntervalSeconds;
    private readonly sendApiKeyAsQueryParam?;
    private readonly numRetriesPerRequest;
    private readonly additionalUserHeaders?;
    private readonly logger;
    private currentNodeIndex;
    constructor(configuration: Configuration);
    get<T>(endpoint: string, queryParameters?: any, { abortSignal, responseType, }?: {
        abortSignal?: any;
        responseType?: AxiosRequestConfig["responseType"] | undefined;
    }): Promise<T>;
    delete<T>(endpoint: string, queryParameters?: any): Promise<T>;
    post<T>(endpoint: string, bodyParameters?: any, queryParameters?: any, additionalHeaders?: any): Promise<T>;
    put<T>(endpoint: string, bodyParameters?: any, queryParameters?: any): Promise<T>;
    patch<T>(endpoint: string, bodyParameters?: any, queryParameters?: any): Promise<T>;
    performRequest<T>(requestType: Method, endpoint: string, { queryParameters, bodyParameters, additionalHeaders, abortSignal, responseType, skipConnectionTimeout, enableKeepAlive, }: {
        queryParameters?: any;
        bodyParameters?: any;
        additionalHeaders?: any;
        abortSignal?: any;
        responseType?: AxiosRequestConfig["responseType"] | undefined;
        skipConnectionTimeout?: boolean;
        enableKeepAlive?: boolean | undefined;
    }): Promise<T>;
    getNextNode(requestNumber?: number): Node;
    nodeDueForHealthcheck(node: any, requestNumber?: number): boolean;
    initializeMetadataForNodes(): void;
    setNodeHealthcheck(node: any, isHealthy: any): void;
    uriFor(endpoint: string, node: any): string;
    defaultHeaders(): any;
    timer(seconds: any): Promise<void>;
    customErrorForResponse(response: AxiosResponse, messageFromServer: string): TypesenseError;
}

declare class RequestWithCache {
    private responseCache;
    private responsePromiseCache;
    clearCache(): void;
    perform<T>(requestContext: any, requestFunction: (...params: any) => unknown, requestFunctionArguments: any[], cacheOptions: CacheOptions): Promise<T | unknown>;
}
interface CacheOptions {
    cacheResponseForSeconds?: number;
    maxSize?: number;
}

declare class SearchOnlyDocuments<T extends DocumentSchema> implements SearchableDocuments<T> {
    protected collectionName: string;
    protected apiCall: ApiCall;
    protected configuration: Configuration;
    protected requestWithCache: RequestWithCache;
    constructor(collectionName: string, apiCall: ApiCall, configuration: Configuration);
    clearCache(): void;
    search(searchParameters: SearchParams | SearchParamsWithPreset, { cacheSearchResultsForSeconds, abortSignal, }?: SearchOptions): Promise<SearchResponse<T>>;
    protected endpointPath(operation?: string): string;
    static get RESOURCEPATH(): string;
}

interface DeleteQuery {
    filter_by?: string;
    batch_size?: number;
    ignore_not_found?: boolean;
}
interface DeleteResponse {
    num_deleted: number;
}
interface ImportResponseSuccess {
    success: true;
}
interface ImportResponseFail {
    success: false;
    error: string;
    document: DocumentSchema;
    code: number;
}
type ImportResponse = ImportResponseSuccess | ImportResponseFail;
type DocumentSchema = Record<string, any>;
interface SearchParamsWithPreset extends Partial<SearchParams> {
    preset: string;
}
type DropTokensMode = "right_to_left" | "left_to_right" | "both_sides:3";
type OperationMode = "off" | "always" | "fallback";
interface SearchParams {
    q?: string;
    query_by?: string | string[];
    query_by_weights?: string | number[];
    prefix?: string | boolean | boolean[];
    filter_by?: string;
    enable_lazy_filter?: boolean;
    sort_by?: string | string[];
    facet_by?: string | string[];
    max_facet_values?: number;
    facet_sample_threshold?: number;
    facet_sample_percent?: number;
    facet_query?: string;
    facet_query_num_typos?: number;
    facet_return_parent?: string;
    page?: number;
    per_page?: number;
    group_by?: string | string[];
    group_limit?: number;
    group_missing_values?: boolean;
    include_fields?: string | string[];
    exclude_fields?: string | string[];
    highlight_fields?: string | string[];
    highlight_full_fields?: string | string[];
    highlight_affix_num_tokens?: number;
    highlight_start_tag?: string;
    highlight_end_tag?: string;
    enable_highlight_v1?: boolean;
    snippet_threshold?: number;
    num_typos?: string | number | number[];
    min_len_1typo?: number;
    min_len_2typo?: number;
    split_join_tokens?: OperationMode;
    exhaustive_search?: boolean;
    drop_tokens_threshold?: number;
    drop_tokens_mode?: DropTokensMode;
    typo_tokens_threshold?: number;
    pinned_hits?: string | string[];
    hidden_hits?: string | string[];
    limit_hits?: number;
    pre_segmented_query?: boolean;
    enable_overrides?: boolean;
    override_tags?: string | string[];
    prioritize_exact_match?: boolean;
    prioritize_token_position?: boolean;
    prioritize_num_matching_fields?: boolean;
    search_cutoff_ms?: number;
    use_cache?: boolean;
    max_candidates?: number;
    infix?: OperationMode | OperationMode[];
    preset?: string;
    text_match_type?: "max_score" | "max_weight";
    vector_query?: string;
    "x-typesense-api-key"?: string;
    "x-typesense-user-id"?: string;
    offset?: number;
    limit?: number;
    stopwords?: string;
    conversation?: boolean;
    conversation_model_id?: string;
    conversation_id?: string;
    voice_query?: string;
}
type SearchResponseHighlightObject = {
    matched_tokens?: string[];
    snippet?: string;
    value?: string;
};
type SearchResponseHighlight<T> = T extends string | number ? SearchResponseHighlightObject : {
    [TAttribute in keyof T]?: SearchResponseHighlight<T[TAttribute]>;
};
interface SearchResponseHit<T extends DocumentSchema> {
    curated?: true;
    highlights?: [
        {
            field: keyof T;
            snippet?: string;
            value?: string;
            snippets?: string[];
            indices?: number[];
            matched_tokens: string[][] | string[];
        }
    ];
    highlight: SearchResponseHighlight<T>;
    document: T;
    text_match: number;
    text_match_info?: {
        best_field_score: string;
        best_field_weight: number;
        fields_matched: number;
        score: string;
        tokens_matched: number;
    };
}
interface SearchResponseFacetCountSchema<T extends DocumentSchema> {
    counts: {
        count: number;
        highlighted: string;
        value: string;
    }[];
    field_name: keyof T;
    stats: {
        avg?: number;
        max?: number;
        min?: number;
        sum?: number;
    };
}
interface SearchResponseRequestParams {
    collection_name?: string;
    q?: string;
    page?: number;
    per_page?: number;
    first_q?: string;
    voice_query?: {
        transcribed_query?: string;
    };
}
interface SearchResponse<T extends DocumentSchema> {
    facet_counts?: SearchResponseFacetCountSchema<T>[];
    found: number;
    found_docs?: number;
    out_of: number;
    page: number;
    request_params: SearchResponseRequestParams;
    search_time_ms: number;
    search_cutoff?: boolean;
    hits?: SearchResponseHit<T>[];
    grouped_hits?: {
        group_key: string[];
        hits: SearchResponseHit<T>[];
        found?: number;
    }[];
    conversation?: {
        answer: string;
        conversation_history: {
            conversation: object[];
            id: string;
            last_updated: number;
            ttl: number;
        };
        conversation_id: string;
        query: string;
    };
    error?: string;
    code?: number;
}
interface DocumentWriteParameters {
    dirty_values?: "coerce_or_reject" | "coerce_or_drop" | "drop" | "reject";
    action?: "create" | "update" | "upsert" | "emplace";
}
interface UpdateByFilterParameters {
    filter_by?: string;
}
interface UpdateByFilterResponse {
    num_updated: number;
}
interface DocumentImportParameters extends DocumentWriteParameters {
    batch_size?: number;
    return_doc?: boolean;
    return_id?: boolean;
}
interface DocumentsExportParameters {
    filter_by?: string;
    include_fields?: string;
    exclude_fields?: string;
}
interface SearchableDocuments<T extends DocumentSchema> {
    search(searchParameters: SearchParams | SearchParamsWithPreset, options: SearchOptions): Promise<SearchResponse<T>>;
    clearCache(): void;
}
interface WriteableDocuments<T> {
    create(document: T, options: DocumentWriteParameters): Promise<T>;
    upsert(document: T, options: DocumentWriteParameters): Promise<T>;
    update(document: T, options: DocumentWriteParameters): Promise<T>;
    delete(query: DeleteQuery): Promise<DeleteResponse>;
    import(documents: T[] | string, options: DocumentWriteParameters): Promise<string | ImportResponse[]>;
    export(options: DocumentsExportParameters): Promise<string>;
}
interface SearchOptions {
    cacheSearchResultsForSeconds?: number;
    abortSignal?: AbortSignal | null;
}
declare class Documents<T extends DocumentSchema = object> extends SearchOnlyDocuments<T> implements WriteableDocuments<T> {
    constructor(collectionName: string, apiCall: ApiCall, configuration: Configuration);
    create(document: T, options?: DocumentWriteParameters): Promise<T>;
    upsert(document: T, options?: DocumentWriteParameters): Promise<T>;
    update(document: T, options: UpdateByFilterParameters): Promise<UpdateByFilterResponse>;
    update(document: T, options: DocumentWriteParameters): Promise<T>;
    delete(query?: DeleteQuery): Promise<DeleteResponse>;
    createMany(documents: T[], options?: DocumentImportParameters): Promise<ImportResponse[]>;
    /**
     * Import a set of documents in a batch.
     * @param {string|Array} documents - Can be a JSONL string of documents or an array of document objects.
     * @param options
     * @return {string|Array} Returns a JSONL string if the input was a JSONL string, otherwise it returns an array of results.
     */
    import(documents: string, options?: DocumentImportParameters): Promise<string>;
    import(documents: T[], options?: DocumentImportParameters): Promise<ImportResponse[]>;
    /**
     * Imports documents from a NodeJS readable stream of JSONL.
     */
    importStream(readableStream: ReadStream, options?: DocumentImportParameters): Promise<ImportResponse[]>;
    /**
     * Returns a JSONL string for all the documents in this collection
     */
    export(options?: DocumentsExportParameters): Promise<string>;
    /**
     * Returns a NodeJS readable stream of JSONL for all the documents in this collection.
     */
    exportStream(options?: DocumentsExportParameters): Promise<ReadStream>;
}

interface OverrideSchema extends OverrideCreateSchema {
    id: string;
}
interface OverrideDeleteSchema {
    id: string;
}
declare class Override {
    private collectionName;
    private overrideId;
    private apiCall;
    constructor(collectionName: string, overrideId: string, apiCall: ApiCall);
    retrieve(): Promise<OverrideSchema>;
    delete(): Promise<OverrideDeleteSchema>;
    private endpointPath;
}

interface OverrideRuleQuerySchema {
    query?: string;
    match?: "exact" | "contains";
}
interface OverrideRuleFilterSchema {
    filter_by?: string;
}
interface OverrideRuleTagsSchema {
    tags?: string[];
}
interface OverrideCreateSchema {
    rule: OverrideRuleQuerySchema & OverrideRuleFilterSchema & OverrideRuleTagsSchema;
    filter_by?: string;
    sort_by?: string;
    remove_matched_tokens?: boolean;
    replace_query?: string;
    includes?: Array<{
        id: string;
        position: number;
    }>;
    excludes?: Array<{
        id: string;
    }>;
    filter_curated_hits?: boolean;
    effective_from_ts?: number;
    effective_to_ts?: number;
    stop_processing?: boolean;
    metadata?: object;
}
interface OverridesRetrieveSchema {
    overrides: OverrideSchema[];
}
declare class Overrides {
    private collectionName;
    private apiCall;
    constructor(collectionName: string, apiCall: ApiCall);
    upsert(overrideId: string, params: OverrideCreateSchema): Promise<OverrideSchema>;
    retrieve(): Promise<OverridesRetrieveSchema>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

interface SynonymSchema extends SynonymCreateSchema {
    id: string;
}
interface SynonymDeleteSchema {
    id: string;
}
declare class Synonym {
    private collectionName;
    private synonymId;
    private apiCall;
    constructor(collectionName: string, synonymId: string, apiCall: ApiCall);
    retrieve(): Promise<SynonymSchema>;
    delete(): Promise<SynonymDeleteSchema>;
    private endpointPath;
}

interface SynonymCreateSchema {
    synonyms: string[];
    root?: string;
    locale?: string;
    symbols_to_index?: string[];
}
interface SynonymsRetrieveSchema {
    synonyms: SynonymSchema[];
}
declare class Synonyms {
    private collectionName;
    private apiCall;
    constructor(collectionName: string, apiCall: ApiCall);
    upsert(synonymId: string, params: SynonymCreateSchema): Promise<SynonymSchema>;
    retrieve(): Promise<SynonymsRetrieveSchema>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

declare class Document<T extends DocumentSchema = object> {
    private collectionName;
    private documentId;
    private apiCall;
    constructor(collectionName: string, documentId: string, apiCall: ApiCall);
    retrieve(): Promise<T>;
    delete(options?: DeleteQuery): Promise<T>;
    update(partialDocument: Partial<T>, options?: DocumentWriteParameters): Promise<T>;
    private endpointPath;
}

type FieldType = "string" | "int32" | "int64" | "float" | "bool" | "geopoint" | "geopoint[]" | "string[]" | "int32[]" | "int64[]" | "float[]" | "bool[]" | "object" | "object[]" | "auto" | "string*" | "image";
interface CollectionFieldSchema {
    name: string;
    type: FieldType;
    optional?: boolean;
    facet?: boolean;
    index?: boolean;
    sort?: boolean;
    locale?: string;
    infix?: boolean;
    stem?: boolean;
    num_dim?: number;
    store?: boolean;
    [t: string]: unknown;
}
interface CollectionSchema extends CollectionCreateSchema {
    created_at: number;
    num_documents: number;
    num_memory_shards: number;
}
interface CollectionDropFieldSchema {
    name: string;
    drop: true;
}
interface CollectionUpdateSchema extends Partial<Omit<CollectionCreateSchema, "name" | "fields">> {
    fields?: (CollectionFieldSchema | CollectionDropFieldSchema)[];
}
declare class Collection<T extends DocumentSchema = object> {
    private readonly name;
    private readonly apiCall;
    private readonly configuration;
    private readonly _documents;
    private individualDocuments;
    private readonly _overrides;
    private individualOverrides;
    private readonly _synonyms;
    private individualSynonyms;
    constructor(name: string, apiCall: ApiCall, configuration: any);
    retrieve(): Promise<CollectionSchema>;
    update(schema: CollectionUpdateSchema): Promise<CollectionSchema>;
    delete(): Promise<CollectionSchema>;
    exists(): Promise<boolean>;
    documents(): Documents<T>;
    documents(documentId: string): Document<T>;
    overrides(): Overrides;
    overrides(overrideId: string): Override;
    synonyms(): Synonyms;
    synonyms(synonymId: string): Synonym;
    private endpointPath;
}

interface CollectionCreateSchema {
    name: string;
    default_sorting_field?: string;
    fields?: CollectionFieldSchema[];
    symbols_to_index?: string[];
    token_separators?: string[];
    enable_nested_fields?: boolean;
    metadata?: object;
    voice_query_model?: {
        model_name?: string;
    };
}
interface CollectionCreateOptions {
    src_name?: string;
}
interface CollectionsRetrieveOptions {
    exclude_fields?: string;
}
declare class Collections {
    private apiCall;
    constructor(apiCall: ApiCall);
    create(schema: CollectionCreateSchema, options?: CollectionCreateOptions): Promise<CollectionSchema>;
    retrieve(options?: CollectionsRetrieveOptions): Promise<CollectionSchema[]>;
    static get RESOURCEPATH(): string;
}

interface CollectionAliasCreateSchema {
    collection_name: string;
}
interface CollectionAliasSchema extends CollectionAliasCreateSchema {
    name: string;
}
interface CollectionAliasesResponseSchema {
    aliases: CollectionAliasSchema[];
}
declare class Aliases {
    private apiCall;
    constructor(apiCall: ApiCall);
    upsert(name: string, mapping: CollectionAliasCreateSchema): Promise<CollectionAliasSchema>;
    retrieve(): Promise<CollectionAliasesResponseSchema>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

declare class Alias {
    private name;
    private apiCall;
    constructor(name: string, apiCall: ApiCall);
    retrieve(): Promise<CollectionAliasSchema>;
    delete(): Promise<CollectionAliasSchema>;
    private endpointPath;
}

interface KeyCreateSchema {
    actions: string[];
    collections: string[];
    description?: string;
    value?: string;
    value_prefix?: string;
    expires_at?: number;
}
interface KeyDeleteSchema {
    id: number;
}
interface KeySchema extends KeyCreateSchema {
    id: number;
}
declare class Key {
    private id;
    private apiCall;
    constructor(id: number, apiCall: ApiCall);
    retrieve(): Promise<KeySchema>;
    delete(): Promise<KeyDeleteSchema>;
    private endpointPath;
}

interface KeysRetrieveSchema {
    keys: KeySchema[];
}
interface GenerateScopedSearchKeyParams extends Partial<SearchParams> {
    expires_at?: number;
    cache_ttl?: number;
    limit_multi_searches?: number;
}
declare class Keys {
    private apiCall;
    constructor(apiCall: ApiCall);
    create(params: KeyCreateSchema): Promise<KeySchema>;
    retrieve(): Promise<KeysRetrieveSchema>;
    generateScopedSearchKey(searchKey: string, parameters: GenerateScopedSearchKeyParams): string;
    static get RESOURCEPATH(): string;
}

interface DebugResponseSchema {
    state: number;
    version: string;
}
declare class Debug {
    private apiCall;
    constructor(apiCall: ApiCall);
    retrieve(): Promise<DebugResponseSchema>;
}

interface MetricsResponse {
    [key: `system_cpu${number}_active_percentage`]: string;
    system_cpu_active_percentage: string;
    system_disk_total_bytes: string;
    system_disk_used_bytes: string;
    system_memory_total_bytes: string;
    system_memory_total_swap_bytes?: string;
    system_memory_used_bytes: string;
    system_memory_used_swap_bytes?: string;
    system_network_received_bytes: string;
    system_network_sent_bytes: string;
    typesense_memory_active_bytes: string;
    typesense_memory_allocated_bytes: string;
    typesense_memory_fragmentation_ratio: string;
    typesense_memory_mapped_bytes: string;
    typesense_memory_metadata_bytes: string;
    typesense_memory_resident_bytes: string;
    typesense_memory_retained_bytes: string;
}
declare class Metrics$1 {
    private apiCall;
    constructor(apiCall: ApiCall);
    retrieve(): Promise<MetricsResponse>;
}

interface EndpointStats {
    [endpoint: string]: number;
}
interface StatsResponse {
    delete_latency_ms?: number;
    delete_requests_per_second?: number;
    import_latency_ms?: number;
    import_requests_per_second?: number;
    latency_ms?: EndpointStats;
    overloaded_requests_per_second?: number;
    pending_write_batches?: number;
    requests_per_second?: EndpointStats;
    search_latency_ms?: number;
    search_requests_per_second?: number;
    total_requests_per_second?: number;
    write_latency_ms?: number;
    write_requests_per_second?: number;
}
declare class Metrics {
    private apiCall;
    constructor(apiCall: ApiCall);
    retrieve(): Promise<StatsResponse>;
}

interface HealthResponse {
    ok: boolean;
}
declare class Health {
    private apiCall;
    constructor(apiCall: ApiCall);
    retrieve(): Promise<HealthResponse>;
}

declare class Operations {
    private apiCall;
    constructor(apiCall: ApiCall);
    perform(operationName: "vote" | "snapshot" | "cache/clear" | string, queryParameters?: Record<string, any>): Promise<any>;
}

interface MultiSearchRequestSchema extends SearchParams {
    collection?: string;
    "x-typesense-api-key"?: string;
}
interface MultiSearchRequestWithPresetSchema extends SearchParamsWithPreset {
    collection?: string;
    "x-typesense-api-key"?: string;
}
interface MultiSearchRequestsSchema {
    searches: (MultiSearchRequestSchema | MultiSearchRequestWithPresetSchema)[];
}
interface MultiSearchResponse<T extends DocumentSchema[] = []> {
    results: {
        [Index in keyof T]: SearchResponse<T[Index]>;
    } & {
        length: T["length"];
    };
}
declare class MultiSearch {
    private apiCall;
    private configuration;
    private useTextContentType;
    private requestWithCache;
    constructor(apiCall: ApiCall, configuration: Configuration, useTextContentType?: boolean);
    clearCache(): void;
    perform<T extends DocumentSchema[] = []>(searchRequests: MultiSearchRequestsSchema, commonParams?: Partial<MultiSearchRequestSchema>, { cacheSearchResultsForSeconds, }?: {
        cacheSearchResultsForSeconds?: number;
    }): Promise<MultiSearchResponse<T>>;
}

interface PresetSchema extends PresetCreateSchema {
    name: string;
}
interface PresetDeleteSchema {
    name: string;
}
declare class Preset {
    private presetId;
    private apiCall;
    constructor(presetId: string, apiCall: ApiCall);
    retrieve(): Promise<PresetSchema>;
    delete(): Promise<PresetDeleteSchema>;
    private endpointPath;
}

interface PresetCreateSchema {
    value: SearchParams | MultiSearchRequestsSchema;
}
interface PresetsRetrieveSchema {
    presets: PresetSchema[];
}
declare class Presets {
    private apiCall;
    constructor(apiCall: ApiCall);
    upsert(presetId: string, params: PresetCreateSchema): Promise<PresetSchema>;
    retrieve(): Promise<PresetsRetrieveSchema>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

interface AnalyticsRuleCreateSchema {
    type: "popular_queries" | "nohits_queries" | "counter";
    params: {
        source: {
            collections: string[];
            events?: Array<{
                type: string;
                weight: number;
                name: string;
            }>;
        };
        expand_query?: boolean;
        destination: {
            collection: string;
            counter_field?: string;
        };
        limit?: number;
    };
}
interface AnalyticsRuleDeleteSchema {
    name: string;
}
interface AnalyticsRuleSchema extends AnalyticsRuleCreateSchema {
    name: string;
}
declare class AnalyticsRule {
    private name;
    private apiCall;
    constructor(name: string, apiCall: ApiCall);
    retrieve(): Promise<AnalyticsRuleSchema>;
    delete(): Promise<AnalyticsRuleDeleteSchema>;
    private endpointPath;
}

interface AnalyticsRulesRetrieveSchema {
    rules: AnalyticsRuleSchema[];
}
declare class AnalyticsRules {
    private readonly apiCall;
    constructor(apiCall: ApiCall);
    upsert(name: string, params: AnalyticsRuleCreateSchema): Promise<AnalyticsRuleCreateSchema>;
    retrieve(): Promise<AnalyticsRulesRetrieveSchema>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

interface AnalyticsEventCreateSchema {
    type: string;
    name: string;
    data?: object;
}

declare class AnalyticsEvents {
    private readonly apiCall;
    constructor(apiCall: ApiCall);
    create(params: AnalyticsEventCreateSchema): Promise<AnalyticsEventCreateSchema>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

declare class Analytics {
    private readonly apiCall;
    private readonly _analyticsRules;
    private readonly individualAnalyticsRules;
    private readonly _analyticsEvents;
    constructor(apiCall: ApiCall);
    rules(id?: string): AnalyticsRules | AnalyticsRule;
    events(): AnalyticsEvents;
    static get RESOURCEPATH(): string;
}

interface StopwordSchema extends StopwordCreateSchema {
    id: string;
    stopwords: string[];
    locale?: string;
}
interface StopwordDeleteSchema {
    id: string;
}
declare class Stopword {
    private stopwordId;
    private apiCall;
    constructor(stopwordId: string, apiCall: ApiCall);
    retrieve(): Promise<StopwordSchema>;
    delete(): Promise<StopwordDeleteSchema>;
    private endpointPath;
}

interface StopwordCreateSchema {
    stopwords: string[];
    locale?: string;
}
interface StopwordsRetrieveSchema {
    stopwords: StopwordSchema[];
}
declare class Stopwords {
    private apiCall;
    constructor(apiCall: ApiCall);
    upsert(stopwordId: string, params: StopwordCreateSchema): Promise<StopwordSchema>;
    retrieve(): Promise<StopwordsRetrieveSchema>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

interface ConversationModelCreateSchema {
    id?: string;
    model_name: string;
    api_key?: string;
    system_prompt?: string;
    max_bytes: number;
    history_collection?: string;
}
interface ConversationModelDeleteSchema {
    id: string;
}
interface ConversationModelSchema extends ConversationModelCreateSchema {
    id: string;
}
declare class ConversationModel {
    private id;
    private apiCall;
    constructor(id: string, apiCall: ApiCall);
    update(params: ConversationModelCreateSchema): Promise<ConversationModelCreateSchema>;
    retrieve(): Promise<ConversationModelSchema>;
    delete(): Promise<ConversationModelDeleteSchema>;
    private endpointPath;
}

declare class ConversationModels {
    private readonly apiCall;
    constructor(apiCall: ApiCall);
    create(params: ConversationModelCreateSchema): Promise<ConversationModelCreateSchema>;
    retrieve(): Promise<ConversationModelSchema[]>;
    private endpointPath;
    static get RESOURCEPATH(): string;
}

interface ConversationDeleteSchema {
    id: number;
}
interface ConversationUpdateSchema {
    ttl: number;
}
interface ConversationSchema {
    id: number;
    conversation: object[];
    last_updated: number;
    ttl: number;
}
declare class Conversation {
    private id;
    private apiCall;
    constructor(id: string, apiCall: ApiCall);
    retrieve(): Promise<ConversationSchema[]>;
    update(params: ConversationUpdateSchema): Promise<ConversationUpdateSchema>;
    delete(): Promise<ConversationDeleteSchema>;
    private endpointPath;
}

interface ConversationsRetrieveSchema {
    conversations: ConversationSchema[];
}
declare class Conversations {
    private readonly apiCall;
    private readonly _conversationsModels;
    private readonly individualConversationModels;
    constructor(apiCall: ApiCall);
    retrieve(): Promise<ConversationsRetrieveSchema>;
    models(): ConversationModels;
    models(id: string): ConversationModel;
    static get RESOURCEPATH(): string;
}

declare class Client {
    configuration: Configuration;
    apiCall: ApiCall;
    debug: Debug;
    metrics: Metrics$1;
    stats: Metrics;
    health: Health;
    operations: Operations;
    multiSearch: MultiSearch;
    analytics: Analytics;
    private readonly _collections;
    private readonly individualCollections;
    private readonly _aliases;
    private readonly individualAliases;
    private readonly _keys;
    private readonly individualKeys;
    private readonly _presets;
    private readonly individualPresets;
    private readonly _stopwords;
    private readonly individualStopwords;
    private readonly _conversations;
    private readonly individualConversations;
    constructor(options: ConfigurationOptions);
    collections(): Collections;
    collections<T extends Record<string, any> = object>(collectionName: string): Collection<T>;
    aliases(): Aliases;
    aliases(aliasName: string): Alias;
    keys(): Keys;
    keys(id: number): Key;
    presets(): Presets;
    presets(id: string): Preset;
    stopwords(): Stopwords;
    stopwords(id: string): Stopword;
    conversations(): Conversations;
    conversations(id: string): Conversation;
}

declare class SearchOnlyCollection<T extends DocumentSchema = object> {
    private readonly name;
    private readonly apiCall;
    private readonly configuration;
    private readonly _documents;
    constructor(name: string, apiCall: ApiCall, configuration: any);
    documents(): SearchableDocuments<T>;
}

declare class SearchClient {
    readonly multiSearch: MultiSearch;
    private readonly configuration;
    private readonly apiCall;
    private readonly individualCollections;
    constructor(options: ConfigurationOptions);
    clearCache(): void;
    collections<TDocumentSchema extends DocumentSchema = object>(collectionName: string): SearchOnlyCollection<TDocumentSchema> | SearchOnlyCollection;
}

declare class HTTPError extends TypesenseError {
}

declare class MissingConfigurationError extends TypesenseError {
}

declare class ObjectAlreadyExists extends TypesenseError {
}

declare class ObjectNotFound extends TypesenseError {
}

declare class ObjectUnprocessable extends TypesenseError {
}

declare class RequestMalformed extends TypesenseError {
}

declare class RequestUnauthorized extends TypesenseError {
}

declare class ServerError extends TypesenseError {
}

declare class ImportError extends TypesenseError {
    importResults: ImportResponse[];
    constructor(message: string, importResults: ImportResponse[]);
}

type Errors_HTTPError = HTTPError;
declare const Errors_HTTPError: typeof HTTPError;
type Errors_ImportError = ImportError;
declare const Errors_ImportError: typeof ImportError;
type Errors_MissingConfigurationError = MissingConfigurationError;
declare const Errors_MissingConfigurationError: typeof MissingConfigurationError;
type Errors_ObjectAlreadyExists = ObjectAlreadyExists;
declare const Errors_ObjectAlreadyExists: typeof ObjectAlreadyExists;
type Errors_ObjectNotFound = ObjectNotFound;
declare const Errors_ObjectNotFound: typeof ObjectNotFound;
type Errors_ObjectUnprocessable = ObjectUnprocessable;
declare const Errors_ObjectUnprocessable: typeof ObjectUnprocessable;
type Errors_RequestMalformed = RequestMalformed;
declare const Errors_RequestMalformed: typeof RequestMalformed;
type Errors_RequestUnauthorized = RequestUnauthorized;
declare const Errors_RequestUnauthorized: typeof RequestUnauthorized;
type Errors_ServerError = ServerError;
declare const Errors_ServerError: typeof ServerError;
type Errors_TypesenseError = TypesenseError;
declare const Errors_TypesenseError: typeof TypesenseError;
declare namespace Errors {
  export { Errors_HTTPError as HTTPError, Errors_ImportError as ImportError, Errors_MissingConfigurationError as MissingConfigurationError, Errors_ObjectAlreadyExists as ObjectAlreadyExists, Errors_ObjectNotFound as ObjectNotFound, Errors_ObjectUnprocessable as ObjectUnprocessable, Errors_RequestMalformed as RequestMalformed, Errors_RequestUnauthorized as RequestUnauthorized, Errors_ServerError as ServerError, Errors_TypesenseError as TypesenseError };
}

declare const _default: {
    Client: typeof Client;
    SearchClient: typeof SearchClient;
    Errors: typeof Errors;
};

export { Client, Errors, SearchClient, _default as default };
