import ApiCall from "./ApiCall";
import AnalyticsRules from "./AnalyticsRules";

export interface AnalyticsRuleCreateSchema {
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

export interface AnalyticsRuleDeleteSchema {
  name: string;
}

export interface AnalyticsRuleSchema extends AnalyticsRuleCreateSchema {
  name: string;
}

export default class AnalyticsRule {
  constructor(
    private name: string,
    private apiCall: ApiCall,
  ) {}

  async retrieve(): Promise<AnalyticsRuleSchema> {
    return this.apiCall.get<AnalyticsRuleSchema>(this.endpointPath());
  }

  async delete(): Promise<AnalyticsRuleDeleteSchema> {
    return this.apiCall.delete<AnalyticsRuleDeleteSchema>(this.endpointPath());
  }

  private endpointPath(): string {
    return `${AnalyticsRules.RESOURCEPATH}/${encodeURIComponent(this.name)}`;
  }
}
