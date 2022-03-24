import Client from './Typesense/Client';
import SearchClient from './Typesense/SearchClient';
import * as Errors from './Typesense/Errors';
export * from './Typesense/Documents';
export * from './Typesense/Collection';
export * from './Typesense/Collections';
export * from './Typesense/Configuration';
export * from './Typesense/MultiSearch';
export * from './Typesense/Synonym';
export * from './Typesense/Synonym';
export { Client, SearchClient, Errors };
declare const _default: {
    Client: typeof Client;
    SearchClient: typeof SearchClient;
    Errors: typeof Errors;
};
export default _default;
