import Aliases, { CollectionAliasSchema } from "./Aliases";
import ApiCall from "./ApiCall";

export default class Alias {
  constructor(private name: string, private apiCall: ApiCall) {}

  async retrieve(): Promise<CollectionAliasSchema> {
    return this.apiCall.get<CollectionAliasSchema>(this.endpointPath());
  }

  async delete(): Promise<CollectionAliasSchema> {
    return this.apiCall.delete<CollectionAliasSchema>(this.endpointPath());
  }

  private endpointPath(): string {
    return `${Aliases.RESOURCEPATH}/${encodeURIComponent(this.name)}`;
  }
}
