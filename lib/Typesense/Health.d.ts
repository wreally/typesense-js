import type ApiCall from './ApiCall';
export interface HealthResponse {
    ok: boolean;
}
export default class Health {
    private apiCall;
    constructor(apiCall: ApiCall);
    retrieve(): Promise<HealthResponse>;
}
