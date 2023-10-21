import ApiCall from "./ApiCall";
import AnalyticsRules from "./AnalyticsRules";
import AnalyticsRule from "./AnalyticsRule";

const RESOURCEPATH = "/analytics";

export default class Analytics {
  private readonly _analyticsRules: AnalyticsRules;
  private readonly individualAnalyticsRules: Record<string, AnalyticsRule> = {};

  constructor(private readonly apiCall: ApiCall) {
    this.apiCall = apiCall;
    this._analyticsRules = new AnalyticsRules(this.apiCall);
  }

  rules(): AnalyticsRules;
  rules(id: string): AnalyticsRule;
  rules(id?: string): AnalyticsRules | AnalyticsRule {
    if (id === undefined) {
      return this._analyticsRules;
    } else {
      if (this.individualAnalyticsRules[id] === undefined) {
        this.individualAnalyticsRules[id] = new AnalyticsRule(id, this.apiCall);
      }
      return this.individualAnalyticsRules[id];
    }
  }

  static get RESOURCEPATH() {
    return RESOURCEPATH;
  }
}
