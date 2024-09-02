/// <reference types="node" />
import type { ReadStream } from "fs";
import ApiCall from "./ApiCall";
import Configuration from "./Configuration";
import { SearchOnlyDocuments } from "./SearchOnlyDocuments";
export interface DeleteQuery {
    filter_by?: string;
    batch_size?: number;
    ignore_not_found?: boolean;
}
export interface DeleteResponse {
    num_deleted: number;
}
interface ImportResponseSuccess {
    success: true;
}
export interface ImportResponseFail {
    success: false;
    error: string;
    document: DocumentSchema;
    code: number;
}
export type ImportResponse = ImportResponseSuccess | ImportResponseFail;
export type DocumentSchema = Record<string, any>;
export interface SearchParamsWithPreset extends Partial<SearchParams> {
    preset: string;
}
type DropTokensMode = "right_to_left" | "left_to_right" | "both_sides:3";
type OperationMode = "off" | "always" | "fallback";
export interface SearchParams {
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
export type SearchResponseHighlight<T> = T extends string | number ? SearchResponseHighlightObject : {
    [TAttribute in keyof T]?: SearchResponseHighlight<T[TAttribute]>;
};
export interface SearchResponseHit<T extends DocumentSchema> {
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
export interface SearchResponseFacetCountSchema<T extends DocumentSchema> {
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
export interface SearchResponseRequestParams {
    collection_name?: string;
    q?: string;
    page?: number;
    per_page?: number;
    first_q?: string;
    voice_query?: {
        transcribed_query?: string;
    };
}
export interface SearchResponse<T extends DocumentSchema> {
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
export interface DocumentWriteParameters {
    dirty_values?: "coerce_or_reject" | "coerce_or_drop" | "drop" | "reject";
    action?: "create" | "update" | "upsert" | "emplace";
}
export interface UpdateByFilterParameters {
    filter_by?: string;
}
export interface UpdateByFilterResponse {
    num_updated: number;
}
export interface DocumentImportParameters extends DocumentWriteParameters {
    batch_size?: number;
    return_doc?: boolean;
    return_id?: boolean;
}
export interface DocumentsExportParameters {
    filter_by?: string;
    include_fields?: string;
    exclude_fields?: string;
}
export interface SearchableDocuments<T extends DocumentSchema> {
    search(searchParameters: SearchParams | SearchParamsWithPreset, options: SearchOptions): Promise<SearchResponse<T>>;
    clearCache(): void;
}
export interface WriteableDocuments<T> {
    create(document: T, options: DocumentWriteParameters): Promise<T>;
    upsert(document: T, options: DocumentWriteParameters): Promise<T>;
    update(document: T, options: DocumentWriteParameters): Promise<T>;
    delete(query: DeleteQuery): Promise<DeleteResponse>;
    import(documents: T[] | string, options: DocumentWriteParameters): Promise<string | ImportResponse[]>;
    export(options: DocumentsExportParameters): Promise<string>;
}
export interface SearchOptions {
    cacheSearchResultsForSeconds?: number;
    abortSignal?: AbortSignal | null;
}
export default class Documents<T extends DocumentSchema = object> extends SearchOnlyDocuments<T> implements WriteableDocuments<T> {
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
export {};
