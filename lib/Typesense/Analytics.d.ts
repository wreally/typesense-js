import ApiCall from "./ApiCall";
import AnalyticsRules from "./AnalyticsRules";
import AnalyticsRule from "./AnalyticsRule";
export default class Analytics {
    private readonly apiCall;
    private readonly _analyticsRules;
    private readonly individualAnalyticsRules;
    constructor(apiCall: ApiCall);
    rules(): AnalyticsRules;
    rules(id: string): AnalyticsRule;
    static get RESOURCEPATH(): string;
}
