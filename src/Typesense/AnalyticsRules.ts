import ApiCall from "./ApiCall";
import {
  AnalyticsRuleCreateSchema,
  AnalyticsRuleSchema,
} from "./AnalyticsRule";

export interface AnalyticsRulesRetrieveSchema {
  rules: AnalyticsRuleSchema[];
}

const RESOURCEPATH = "/analytics/rules";

export default class AnalyticsRules {
  constructor(private readonly apiCall: ApiCall) {
    this.apiCall = apiCall;
  }

  async upsert(
    name: string,
    params: AnalyticsRuleCreateSchema
  ): Promise<AnalyticsRuleCreateSchema> {
    return this.apiCall.put<AnalyticsRuleCreateSchema>(
      this.endpointPath(name),
      params
    );
  }

  async retrieve(): Promise<AnalyticsRulesRetrieveSchema> {
    return this.apiCall.get<AnalyticsRulesRetrieveSchema>(this.endpointPath());
  }

  private endpointPath(operation?: string): string {
    return `${AnalyticsRules.RESOURCEPATH}${
      operation === undefined ? "" : "/" + encodeURIComponent(operation)
    }`;
  }

  static get RESOURCEPATH() {
    return RESOURCEPATH;
  }
}
