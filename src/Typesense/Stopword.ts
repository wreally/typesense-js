import ApiCall from "./ApiCall";
import Stopwords, { StopwordCreateSchema } from "./Stopwords";

export interface StopwordSchema extends StopwordCreateSchema {
  id: string;
  stopwords: string[];
  locale?: string;
}

export interface StopwordDeleteSchema {
  id: string;
}

export default class Stopword {
  constructor(
    private stopwordId: string,
    private apiCall: ApiCall,
  ) {}

  async retrieve(): Promise<StopwordSchema> {
    return this.apiCall.get<StopwordSchema>(this.endpointPath());
  }

  async delete(): Promise<StopwordDeleteSchema> {
    return this.apiCall.delete<StopwordDeleteSchema>(this.endpointPath());
  }

  private endpointPath(): string {
    return `${Stopwords.RESOURCEPATH}/${encodeURIComponent(this.stopwordId)}`;
  }
}
