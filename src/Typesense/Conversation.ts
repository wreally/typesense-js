import ApiCall from "./ApiCall";
import Conversations from "./Conversations";

export interface ConversationDeleteSchema {
  id: number;
}

export interface ConversationUpdateSchema {
  ttl: number;
}

export interface ConversationSchema {
  id: number;
  conversation: object[];
  last_updated: number;
  ttl: number;
}

export default class Conversation {
  constructor(
    private id: string,
    private apiCall: ApiCall,
  ) {}

  async retrieve(): Promise<ConversationSchema[]> {
    return this.apiCall.get<ConversationSchema[]>(this.endpointPath());
  }

  async update(
    params: ConversationUpdateSchema,
  ): Promise<ConversationUpdateSchema> {
    return this.apiCall.put<ConversationUpdateSchema>(
      this.endpointPath(),
      params,
    );
  }

  async delete(): Promise<ConversationDeleteSchema> {
    return this.apiCall.delete<ConversationDeleteSchema>(this.endpointPath());
  }

  private endpointPath(): string {
    return `${Conversations.RESOURCEPATH}/${encodeURIComponent(this.id)}`;
  }
}
