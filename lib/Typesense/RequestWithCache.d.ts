export default class RequestWithCache {
    private responseCache;
    perform<T>(requestContext: any, requestFunction: (...params: any) => unknown, requestFunctionArguments: any[], cacheOptions: CacheOptions): Promise<T>;
}
interface CacheOptions {
    cacheResponseForSeconds?: number;
    maxSize?: number;
}
export {};
