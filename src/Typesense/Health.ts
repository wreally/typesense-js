import type ApiCall from './ApiCall'

const RESOURCEPATH = '/health'

export interface HealthResponse {
  ok: boolean
}

export default class Health {
  constructor (private apiCall: ApiCall) {}

  async retrieve (): Promise<HealthResponse> {
    return this.apiCall.get<HealthResponse>(RESOURCEPATH)
  }
}
