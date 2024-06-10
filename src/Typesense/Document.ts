import ApiCall from "./ApiCall";
import Collections from "./Collections";
import Documents, {
  DeleteQuery,
  DocumentSchema,
  DocumentWriteParameters,
} from "./Documents";

export class Document<T extends DocumentSchema = object> {
  constructor(
    private collectionName: string,
    private documentId: string,
    private apiCall: ApiCall
  ) {}

  async retrieve(): Promise<T> {
    return this.apiCall.get<T>(this.endpointPath());
  }

  async delete(options?: DeleteQuery): Promise<T> {
    return this.apiCall.delete<T>(this.endpointPath(), options);
  }

  async update(
    partialDocument: Partial<T>,
    options: DocumentWriteParameters = {}
  ): Promise<T> {
    return this.apiCall.patch<T>(this.endpointPath(), partialDocument, options);
  }

  private endpointPath(): string {
    return `${Collections.RESOURCEPATH}/${encodeURIComponent(this.collectionName)}${Documents.RESOURCEPATH}/${encodeURIComponent(this.documentId)}`;
  }
}
