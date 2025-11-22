import { CacheOptions, RuntimeCache } from './types';
/**
 * Retrieves the Vercel Runtime Cache.
 *
 * Keys are hashed to ensure they are unique and consistent. The hashing function can be overridden by providing a custom
 * `keyHashFunction` in the `cacheOptions` parameter.
 *
 * To specify a namespace for the cache keys, you can pass a `namespace` option in the `cacheOptions` parameter. If
 * a namespace is provided, the cache keys will be prefixed with the namespace followed by a separator (default is `$`). The
 * namespaceSeparator can also be customized using the `namespaceSeparator` option.
 *
 * @param cacheOptions - Optional configuration for the cache.
 * @returns An instance of the Vercel Runtime Cache.
 * @throws {Error} If no cache is available in the context and `InMemoryCache` cannot be created.
 */
export declare const getCache: (cacheOptions?: CacheOptions) => RuntimeCache;
export declare enum PkgCacheState {
    Fresh = "fresh",
    Stale = "stale",
    Expired = "expired",
    NotFound = "notFound",
    Error = "error"
}
export declare const HEADERS_VERCEL_CACHE_STATE = "x-vercel-cache-state";
export declare const HEADERS_VERCEL_REVALIDATE = "x-vercel-revalidate";
export declare const HEADERS_VERCEL_CACHE_TAGS = "x-vercel-cache-tags";
export declare const HEADERS_VERCEL_CACHE_ITEM_NAME = "x-vercel-cache-item-name";
