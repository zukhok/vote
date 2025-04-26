declare module "parse-server"
{
    export const __esModule: boolean;
    export const FileSystemAdapter: any;
    export const InMemoryCacheAdapter: any;
    export const NullCacheAdapter: any;
    export const RedisCacheAdapter: any;
    export const LRUCacheAdapter: any;
    export const PushWorker: any;
    export const ParseGraphQLServer: any;
    export const logger: any;
    export default _default;
    export var TestUtils: any;
    export var SchemaMigrations: any;
    declare function _ParseServer(options: any): any;
    declare namespace _ParseServer
    {
        let createLiveQueryServer: any;
        let start: any;
    }
    export const S3Adapter: any;
    export const GCSAdapter: any;
    declare var _default: any;
    export {_ParseServer as ParseServer};
}