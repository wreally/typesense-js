import ApiCall from "./ApiCall";
import ConversationModels from "./ConversationModels";

export interface ConversationModelCreateSchema {
  id?: string;
  model_name: string;
  api_key?: string;
  system_prompt?: string;
  max_bytes: number;
  history_collection?: string;
}

export interface ConversationModelDeleteSchema {
  id: string;
}

export interface ConversationModelSchema extends ConversationModelCreateSchema {
  id: string;
}

export default class ConversationModel {
  constructor(
    private id: string,
    private apiCall: ApiCall,
  ) {}

  async update(
    params: ConversationModelCreateSchema,
  ): Promise<ConversationModelCreateSchema> {
    return this.apiCall.put<ConversationModelCreateSchema>(
      this.endpointPath(),
      params,
    );
  }

  async retrieve(): Promise<ConversationModelSchema> {
    return this.apiCall.get<ConversationModelSchema>(this.endpointPath());
  }

  async delete(): Promise<ConversationModelDeleteSchema> {
    return this.apiCall.delete<ConversationModelDeleteSchema>(
      this.endpointPath(),
    );
  }

  private endpointPath(): string {
    return `${ConversationModels.RESOURCEPATH}/${encodeURIComponent(this.id)}`;
  }
}
