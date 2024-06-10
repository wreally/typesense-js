import ApiCall from "./ApiCall";
import { PresetSchema } from "./Preset";
import { SearchParams } from "./Documents";
import { MultiSearchRequestsSchema } from "./MultiSearch";

const RESOURCEPATH = "/presets";

export interface PresetCreateSchema {
  value: SearchParams | MultiSearchRequestsSchema;
}

export interface PresetsRetrieveSchema {
  presets: PresetSchema[];
}

export default class Presets {
  constructor(private apiCall: ApiCall) {}

  async upsert(
    presetId: string,
    params: PresetCreateSchema
  ): Promise<PresetSchema> {
    return this.apiCall.put<PresetSchema>(this.endpointPath(presetId), params);
  }

  async retrieve(): Promise<PresetsRetrieveSchema> {
    return this.apiCall.get<PresetsRetrieveSchema>(this.endpointPath());
  }

  private endpointPath(operation?: string): string {
    return `${Presets.RESOURCEPATH}${
      operation === undefined ? "" : "/" + encodeURIComponent(operation)
    }`;
  }

  static get RESOURCEPATH(): string {
    return RESOURCEPATH;
  }
}
