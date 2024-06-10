import ApiCall from "./ApiCall";
import Collections from "./Collections";
import Overrides, { OverrideCreateSchema } from "./Overrides";

export interface OverrideSchema extends OverrideCreateSchema {
  id: string;
}

export interface OverrideDeleteSchema {
  id: string;
}

export default class Override {
  constructor(
    private collectionName: string,
    private overrideId: string,
    private apiCall: ApiCall
  ) {}

  async retrieve(): Promise<OverrideSchema> {
    return this.apiCall.get<OverrideSchema>(this.endpointPath());
  }

  async delete(): Promise<OverrideDeleteSchema> {
    return this.apiCall.delete<OverrideDeleteSchema>(this.endpointPath());
  }

  private endpointPath(): string {
    return `${Collections.RESOURCEPATH}/${encodeURIComponent(this.collectionName)}${Overrides.RESOURCEPATH}/${encodeURIComponent(this.overrideId)}`;
  }
}
