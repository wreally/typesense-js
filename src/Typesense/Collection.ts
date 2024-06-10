import ApiCall from "./ApiCall";
import Collections, { CollectionCreateSchema } from "./Collections";
import Documents, { DocumentSchema } from "./Documents";
import { ObjectNotFound } from "./Errors";
import Overrides from "./Overrides";
import Override from "./Override";
import Synonyms from "./Synonyms";
import Synonym from "./Synonym";
import { Document } from "./Document";

export type FieldType =
  | "string"
  | "int32"
  | "int64"
  | "float"
  | "bool"
  | "geopoint"
  | "geopoint[]"
  | "string[]"
  | "int32[]"
  | "int64[]"
  | "float[]"
  | "bool[]"
  | "object"
  | "object[]"
  | "auto"
  | "string*"
  | "image";

export interface CollectionFieldSchema {
  name: string;
  type: FieldType;
  optional?: boolean;
  facet?: boolean;
  index?: boolean;
  sort?: boolean;
  locale?: string;
  infix?: boolean;
  stem?: boolean;
  num_dim?: number;
  store?: boolean;
  [t: string]: unknown;
}

export interface CollectionSchema extends CollectionCreateSchema {
  created_at: number;
  num_documents: number;
  num_memory_shards: number;
}

export interface CollectionDropFieldSchema {
  name: string;
  drop: true;
}

export interface CollectionUpdateSchema
  extends Partial<Omit<CollectionCreateSchema, "name" | "fields">> {
  fields?: (CollectionFieldSchema | CollectionDropFieldSchema)[];
}

export default class Collection<T extends DocumentSchema = object> {
  private readonly _documents: Documents<T>;
  private individualDocuments: Record<string, Document<T>> = {};
  private readonly _overrides: Overrides;
  private individualOverrides: Record<string, Override> = {};
  private readonly _synonyms: Synonyms;
  private individualSynonyms: Record<string, Synonym> = {};

  constructor(
    private readonly name: string,
    private readonly apiCall: ApiCall,
    private readonly configuration: any,
  ) {
    this.name = name;
    this.apiCall = apiCall;
    this.configuration = configuration;

    this._documents = new Documents(
      this.name,
      this.apiCall,
      this.configuration,
    );
    this._overrides = new Overrides(this.name, this.apiCall);
    this._synonyms = new Synonyms(this.name, this.apiCall);
  }

  async retrieve(): Promise<CollectionSchema> {
    return this.apiCall.get<CollectionSchema>(this.endpointPath());
  }

  async update(schema: CollectionUpdateSchema): Promise<CollectionSchema> {
    return this.apiCall.patch<CollectionSchema>(this.endpointPath(), schema);
  }

  async delete(): Promise<CollectionSchema> {
    return this.apiCall.delete<CollectionSchema>(this.endpointPath());
  }

  async exists(): Promise<boolean> {
    try {
      await this.retrieve();
      return true;
    } catch (e) {
      if (e instanceof ObjectNotFound) return false;
      throw e;
    }
  }

  documents(): Documents<T>;
  documents(documentId: string): Document<T>;
  documents(documentId?: string): Document<T> | Documents<T> {
    if (!documentId) {
      return this._documents;
    } else {
      if (this.individualDocuments[documentId] === undefined) {
        this.individualDocuments[documentId] = new Document(
          this.name,
          documentId,
          this.apiCall,
        );
      }
      return this.individualDocuments[documentId];
    }
  }

  overrides(): Overrides;
  overrides(overrideId: string): Override;
  overrides(overrideId?: string): Overrides | Override {
    if (overrideId === undefined) {
      return this._overrides;
    } else {
      if (this.individualOverrides[overrideId] === undefined) {
        this.individualOverrides[overrideId] = new Override(
          this.name,
          overrideId,
          this.apiCall,
        );
      }
      return this.individualOverrides[overrideId];
    }
  }

  synonyms(): Synonyms;
  synonyms(synonymId: string): Synonym;
  synonyms(synonymId?: string): Synonyms | Synonym {
    if (synonymId === undefined) {
      return this._synonyms;
    } else {
      if (this.individualSynonyms[synonymId] === undefined) {
        this.individualSynonyms[synonymId] = new Synonym(
          this.name,
          synonymId,
          this.apiCall,
        );
      }
      return this.individualSynonyms[synonymId];
    }
  }

  private endpointPath(): string {
    return `${Collections.RESOURCEPATH}/${encodeURIComponent(this.name)}`;
  }
}
