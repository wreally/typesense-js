import ApiCall from "./ApiCall";
import { AnalyticsEventCreateSchema } from "./AnalyticsEvent";

const RESOURCEPATH = "/analytics/events";

export default class AnalyticsEvents {
  constructor(private readonly apiCall: ApiCall) {
    this.apiCall = apiCall;
  }

  async create(
    params: AnalyticsEventCreateSchema,
  ): Promise<AnalyticsEventCreateSchema> {
    return this.apiCall.post<AnalyticsEventCreateSchema>(
      this.endpointPath(),
      params,
    );
  }

  private endpointPath(operation?: string): string {
    return `${AnalyticsEvents.RESOURCEPATH}${
      operation === undefined ? "" : "/" + encodeURIComponent(operation)
    }`;
  }

  static get RESOURCEPATH() {
    return RESOURCEPATH;
  }
}
