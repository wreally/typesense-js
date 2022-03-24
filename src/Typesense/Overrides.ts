import type ApiCall from './ApiCall'
import Collections from './Collections'
import type { OverrideSchema } from './Override'

const RESOURCEPATH = '/overrides'

export interface OverrideCreateSchema {
  rule: {
    query: string
    match: 'exact' | 'contains'
  }
  filter_by?: string
  remove_matched_tokens?: boolean
  includes?: Array<{
    id: string
    position: number
  }>
  excludes?: Array<{ id: string }>
}

export interface OverridesRetrieveSchema {
  overrides: OverrideSchema[]
}

export default class Overrides {
  constructor (private collectionName: string, private apiCall: ApiCall) {}

  async upsert (overrideId: string, params: OverrideCreateSchema): Promise<OverrideSchema> {
    return this.apiCall.put<OverrideSchema>(this.endpointPath(overrideId), params)
  }

  async retrieve (): Promise<OverridesRetrieveSchema> {
    return this.apiCall.get<OverridesRetrieveSchema>(this.endpointPath())
  }

  private endpointPath (operation?: string): string {
    return `${Collections.RESOURCEPATH}/${this.collectionName}${Overrides.RESOURCEPATH}${
      operation === undefined ? '' : '/' + operation
    }`
  }

  static get RESOURCEPATH (): string {
    return RESOURCEPATH
  }
}
