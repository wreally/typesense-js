import type ApiCall from './ApiCall'
import Keys from './Keys'

export interface KeyCreateSchema {
  actions: string[]
  collections: string[]
  description?: string
  value?: string
  expires_at?: number
}

export interface KeyDeleteSchema {
  id: number
}

export interface KeySchema extends KeyCreateSchema {
  id: number
}

export default class Key {
  constructor (private id: number, private apiCall: ApiCall) {}

  async retrieve (): Promise<KeySchema> {
    return this.apiCall.get<KeySchema>(this.endpointPath())
  }

  async delete (): Promise<KeyDeleteSchema> {
    return this.apiCall.delete<KeyDeleteSchema>(this.endpointPath())
  }

  private endpointPath (): string {
    return `${Keys.RESOURCEPATH}/${this.id}`
  }
}
