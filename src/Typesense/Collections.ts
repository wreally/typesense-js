import type ApiCall from './ApiCall'
import type { CollectionFieldSchema, CollectionSchema } from './Collection'

export interface CollectionCreateSchema {
  name: string
  default_sorting_field?: string
  fields: CollectionFieldSchema[]
  symbols_to_index?: string[]
  token_separators?: string[]
}

const RESOURCEPATH = '/collections'

export default class Collections {
  constructor (private apiCall: ApiCall) {}

  async create (schema: CollectionCreateSchema): Promise<CollectionSchema> {
    return this.apiCall.post<CollectionSchema>(RESOURCEPATH, schema)
  }

  async retrieve (): Promise<CollectionSchema[]> {
    return this.apiCall.get<CollectionSchema[]>(RESOURCEPATH)
  }

  static get RESOURCEPATH () {
    return RESOURCEPATH
  }
}
