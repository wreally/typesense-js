import type { ReadStream } from "fs";
import ApiCall from "./ApiCall";
import Configuration from "./Configuration";
import { ImportError } from "./Errors";
import { SearchOnlyDocuments } from "./SearchOnlyDocuments";

// Todo: use generic to extract filter_by values
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

type DropTokensMode =
  | "right_to_left"
  | "left_to_right"
  | "both_sides:3";

type OperationMode = "off" | "always" | "fallback";
export interface SearchParams {
  // From https://typesense.org/docs/latest/api/documents.html#arguments
  q?: string;
  query_by?: string | string[];
  query_by_weights?: string | number[];
  prefix?: string | boolean | boolean[]; // default: true
  filter_by?: string;
  enable_lazy_filter?: boolean; // default: false
  sort_by?: string | string[]; // default: text match desc
  facet_by?: string | string[];
  max_facet_values?: number;
  facet_sample_threshold?: number;
  facet_sample_percent?: number;
  facet_query?: string;
  facet_query_num_typos?: number;
  facet_return_parent?: string;
  page?: number; // default: 1
  per_page?: number; // default: 10, max 250
  group_by?: string | string[];
  group_limit?: number; // default:
  group_missing_values?: boolean;
  include_fields?: string | string[];
  exclude_fields?: string | string[];
  highlight_fields?: string | string[]; // default: all queried fields
  highlight_full_fields?: string | string[]; // default: all fields
  highlight_affix_num_tokens?: number; // default: 4
  highlight_start_tag?: string; // default: <mark>
  highlight_end_tag?: string; // default: </mark>
  enable_highlight_v1?: boolean;
  snippet_threshold?: number; // default: 30
  num_typos?: string | number | number[]; // default: 2
  min_len_1typo?: number;
  min_len_2typo?: number;
  split_join_tokens?: OperationMode;
  exhaustive_search?: boolean;
  drop_tokens_threshold?: number; // default: 10
  drop_tokens_mode?: DropTokensMode;
  typo_tokens_threshold?: number; // default: 100
  pinned_hits?: string | string[];
  hidden_hits?: string | string[];
  limit_hits?: number; // default: no limit
  pre_segmented_query?: boolean;
  enable_overrides?: boolean;
  override_tags?: string | string[];
  prioritize_exact_match?: boolean; // default: true
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

export type SearchResponseHighlight<T> = T extends string | number
  ? SearchResponseHighlightObject
  : {
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
    },
  ];
  highlight: SearchResponseHighlight<T>;
  document: T;
  text_match: number;
  text_match_info?: {
    best_field_score: string; // To prevent scores from being truncated by JSON spec
    best_field_weight: number;
    fields_matched: number;
    score: string; // To prevent scores from being truncated by JSON spec
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

// Todo: we could infer whether this is a grouped response by adding the search params as a generic
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
  search(
    searchParameters: SearchParams | SearchParamsWithPreset,
    options: SearchOptions,
  ): Promise<SearchResponse<T>>;
  clearCache(): void;
}

export interface WriteableDocuments<T> {
  create(document: T, options: DocumentWriteParameters): Promise<T>;
  upsert(document: T, options: DocumentWriteParameters): Promise<T>;
  update(document: T, options: DocumentWriteParameters): Promise<T>;
  delete(query: DeleteQuery): Promise<DeleteResponse>;
  import(
    documents: T[] | string,
    options: DocumentWriteParameters,
  ): Promise<string | ImportResponse[]>;
  export(options: DocumentsExportParameters): Promise<string>;
}

export interface SearchOptions {
  cacheSearchResultsForSeconds?: number;
  abortSignal?: AbortSignal | null;
}

const isNodeJSEnvironment =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export default class Documents<T extends DocumentSchema = object>
  extends SearchOnlyDocuments<T>
  implements WriteableDocuments<T>
{
  constructor(
    collectionName: string,
    apiCall: ApiCall,
    configuration: Configuration,
  ) {
    super(collectionName, apiCall, configuration);
  }

  async create(document: T, options: DocumentWriteParameters = {}): Promise<T> {
    if (!document) throw new Error("No document provided");
    return this.apiCall.post<T>(this.endpointPath(), document, options);
  }

  async upsert(document: T, options: DocumentWriteParameters = {}): Promise<T> {
    if (!document) throw new Error("No document provided");
    return this.apiCall.post<T>(
      this.endpointPath(),
      document,
      Object.assign({}, options, { action: "upsert" }),
    );
  }

  async update(
    document: T,
    options: UpdateByFilterParameters,
  ): Promise<UpdateByFilterResponse>;
  async update(document: T, options: DocumentWriteParameters): Promise<T>;
  async update(
    document: T,
    options: DocumentWriteParameters | UpdateByFilterParameters = {},
  ): Promise<UpdateByFilterResponse | T> {
    if (!document) throw new Error("No document provided");

    if (options["filter_by"] != null) {
      return this.apiCall.patch<T>(
        this.endpointPath(),
        document,
        Object.assign({}, options),
      );
    } else {
      return this.apiCall.post<T>(
        this.endpointPath(),
        document,
        Object.assign({}, options, { action: "update" }),
      );
    }
  }

  async delete(
    query: DeleteQuery = {} as DeleteQuery,
  ): Promise<DeleteResponse> {
    return this.apiCall.delete<DeleteResponse>(this.endpointPath(), query);
  }

  async createMany(documents: T[], options: DocumentImportParameters = {}) {
    this.configuration.logger.warn(
      "createMany is deprecated and will be removed in a future version. Use import instead, which now takes both an array of documents or a JSONL string of documents",
    );
    return this.import(documents, options);
  }

  /**
   * Import a set of documents in a batch.
   * @param {string|Array} documents - Can be a JSONL string of documents or an array of document objects.
   * @param options
   * @return {string|Array} Returns a JSONL string if the input was a JSONL string, otherwise it returns an array of results.
   */
  async import(
    documents: string,
    options?: DocumentImportParameters,
  ): Promise<string>;
  async import(
    documents: T[],
    options?: DocumentImportParameters,
  ): Promise<ImportResponse[]>;
  async import(
    documents: T[] | string,
    options: DocumentImportParameters = {},
  ): Promise<string | ImportResponse[]> {
    let documentsInJSONLFormat;
    if (Array.isArray(documents)) {
      try {
        documentsInJSONLFormat = documents
          .map((document) => JSON.stringify(document))
          .join("\n");
      } catch (error: any) {
        // if rangeerror, throw custom error message
        if (
          error instanceof RangeError &&
          error.message.includes("Too many properties to enumerate")
        ) {
          throw new Error(`${error}
          It looks like you have reached a Node.js limit that restricts the number of keys in an Object: https://stackoverflow.com/questions/9282869/are-there-limits-to-the-number-of-properties-in-a-javascript-object

          Please try reducing the number of keys in your document, or using CURL to import your data.
          `);
        }

        // else, throw the non-range error anyways
        throw new Error(error);
      }
    } else {
      documentsInJSONLFormat = documents;
    }

    const resultsInJSONLFormat = await this.apiCall.performRequest<string>(
      "post",
      this.endpointPath("import"),
      {
        queryParameters: options,
        bodyParameters: documentsInJSONLFormat,
        additionalHeaders: { "Content-Type": "text/plain" },
        skipConnectionTimeout: true, // We never want to client-side-timeout on an import and retry, since imports are syncronous and we want to let them take as long as it takes to complete fully
        enableKeepAlive: isNodeJSEnvironment ? true : false, // This is to prevent ECONNRESET socket hang up errors. Reference: https://github.com/axios/axios/issues/2936#issuecomment-779439991
      },
    );

    if (Array.isArray(documents)) {
      const resultsInJSONFormat = resultsInJSONLFormat
        .split("\n")
        .map((r) => JSON.parse(r)) as ImportResponse[];
      const failedItems = resultsInJSONFormat.filter(
        (r) => r.success === false,
      );
      if (failedItems.length > 0) {
        throw new ImportError(
          `${
            resultsInJSONFormat.length - failedItems.length
          } documents imported successfully, ${
            failedItems.length
          } documents failed during import. Use \`error.importResults\` from the raised exception to get a detailed error reason for each document.`,
          resultsInJSONFormat,
        );
      } else {
        return resultsInJSONFormat;
      }
    } else {
      return resultsInJSONLFormat as string;
    }
  }
  /**
   * Imports documents from a NodeJS readable stream of JSONL.
   */
  async importStream(
    readableStream: ReadStream,
    options: DocumentImportParameters = {},
  ): Promise<ImportResponse[]> {
    const resultsInJSONLFormat = await this.apiCall.performRequest<string>(
      "post",
      this.endpointPath("import"),
      {
        queryParameters: options,
        bodyParameters: readableStream,
        additionalHeaders: { "Content-Type": "text/plain" },
        skipConnectionTimeout: true, // We never want to client-side-timeout on an import and retry, since imports are syncronous and we want to let them take as long as it takes to complete fully
        enableKeepAlive: isNodeJSEnvironment ? true : false, // This is to prevent ECONNRESET socket hang up errors. Reference: https://github.com/axios/axios/issues/2936#issuecomment-779439991
      },
    );

    const resultsInJSONFormat = resultsInJSONLFormat
      .split("\n")
      .map((r) => JSON.parse(r)) as ImportResponse[];
    const failedItems = resultsInJSONFormat.filter((r) => r.success === false);
    if (failedItems.length > 0) {
      throw new ImportError(
        `${
          resultsInJSONFormat.length - failedItems.length
        } documents imported successfully, ${
          failedItems.length
        } documents failed during import. Use \`error.importResults\` from the raised exception to get a detailed error reason for each document.`,
        resultsInJSONFormat,
      );
    } else {
      return resultsInJSONFormat;
    }
  }

  /**
   * Returns a JSONL string for all the documents in this collection
   */
  async export(options: DocumentsExportParameters = {}): Promise<string> {
    return this.apiCall.get<string>(this.endpointPath("export"), options);
  }

  /**
   * Returns a NodeJS readable stream of JSONL for all the documents in this collection.
   */
  async exportStream(
    options: DocumentsExportParameters = {},
  ): Promise<ReadStream> {
    return this.apiCall.get<ReadStream>(this.endpointPath("export"), options, {
      responseType: "stream",
    });
  }
}
