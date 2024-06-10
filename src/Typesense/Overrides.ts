import ApiCall from "./ApiCall";
import Collections from "./Collections";
import { OverrideSchema } from "./Override";

const RESOURCEPATH = "/overrides";

export interface OverrideRuleQuerySchema {
  query?: string;
  match?: "exact" | "contains";
}

export interface OverrideRuleFilterSchema {
  filter_by?: string;
}

export interface OverrideRuleTagsSchema {
  tags?: string[];
}

export interface OverrideCreateSchema {
  rule: OverrideRuleQuerySchema &
    OverrideRuleFilterSchema &
    OverrideRuleTagsSchema;
  filter_by?: string;
  sort_by?: string;
  remove_matched_tokens?: boolean;
  replace_query?: string;
  includes?: Array<{
    id: string;
    position: number;
  }>;
  excludes?: Array<{ id: string }>;
  filter_curated_hits?: boolean;
  effective_from_ts?: number;
  effective_to_ts?: number;
  stop_processing?: boolean;
  metadata?: object;
}

export interface OverridesRetrieveSchema {
  overrides: OverrideSchema[];
}

export default class Overrides {
  constructor(
    private collectionName: string,
    private apiCall: ApiCall,
  ) {}

  async upsert(
    overrideId: string,
    params: OverrideCreateSchema,
  ): Promise<OverrideSchema> {
    return this.apiCall.put<OverrideSchema>(
      this.endpointPath(overrideId),
      params,
    );
  }

  async retrieve(): Promise<OverridesRetrieveSchema> {
    return this.apiCall.get<OverridesRetrieveSchema>(this.endpointPath());
  }

  private endpointPath(operation?: string): string {
    return `${Collections.RESOURCEPATH}/${this.collectionName}${
      Overrides.RESOURCEPATH
    }${operation === undefined ? "" : "/" + encodeURIComponent(operation)}`;
  }

  static get RESOURCEPATH(): string {
    return RESOURCEPATH;
  }
}
