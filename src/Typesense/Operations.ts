import type ApiCall from './ApiCall'

const RESOURCEPATH = '/operations'

export default class Operations {
  constructor (private apiCall: ApiCall) {}

  async perform (operationName: 'vote' | 'snapshot' | string, queryParameters: Record<string, any> = {}): Promise<any> {
    return this.apiCall.post(`${RESOURCEPATH}/${operationName}`, {}, queryParameters)
  }
}
