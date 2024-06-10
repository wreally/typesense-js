import ApiCall from "./ApiCall";
import {
  ConversationModelCreateSchema,
  ConversationModelSchema,
} from "./ConversationModel";

const RESOURCEPATH = "/conversations/models";

export default class ConversationModels {
  constructor(private readonly apiCall: ApiCall) {
    this.apiCall = apiCall;
  }

  async create(
    params: ConversationModelCreateSchema,
  ): Promise<ConversationModelCreateSchema> {
    return this.apiCall.post<ConversationModelCreateSchema>(
      this.endpointPath(),
      params,
    );
  }

  async retrieve(): Promise<ConversationModelSchema[]> {
    return this.apiCall.get<ConversationModelSchema[]>(
      this.endpointPath(),
    );
  }

  private endpointPath(operation?: string): string {
    return `${ConversationModels.RESOURCEPATH}${
      operation === undefined ? "" : "/" + encodeURIComponent(operation)
    }`;
  }

  static get RESOURCEPATH() {
    return RESOURCEPATH;
  }
}
