"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cache_exports = {};
__export(cache_exports, {
  HEADERS_VERCEL_CACHE_ITEM_NAME: () => HEADERS_VERCEL_CACHE_ITEM_NAME,
  HEADERS_VERCEL_CACHE_STATE: () => HEADERS_VERCEL_CACHE_STATE,
  HEADERS_VERCEL_CACHE_TAGS: () => HEADERS_VERCEL_CACHE_TAGS,
  HEADERS_VERCEL_REVALIDATE: () => HEADERS_VERCEL_REVALIDATE,
  PkgCacheState: () => PkgCacheState,
  getCache: () => getCache
});
module.exports = __toCommonJS(cache_exports);
var import_get_context = require("../get-context");
var import_in_memory_cache = require("./in-memory-cache");
var import_build_client = require("./build-client");
const defaultKeyHashFunction = (key) => {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = hash * 33 ^ key.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
};
const defaultNamespaceSeparator = "$";
let inMemoryCacheInstance = null;
let buildCacheInstance = null;
const getCache = (cacheOptions) => {
  const resolveCache = () => {
    let cache;
    if ((0, import_get_context.getContext)().cache) {
      cache = (0, import_get_context.getContext)().cache;
    } else {
      cache = getCacheImplementation(
        process.env.SUSPENSE_CACHE_DEBUG === "true"
      );
    }
    return cache;
  };
  return wrapWithKeyTransformation(
    resolveCache,
    createKeyTransformer(cacheOptions)
  );
};
function createKeyTransformer(cacheOptions) {
  const hashFunction = cacheOptions?.keyHashFunction || defaultKeyHashFunction;
  return (key) => {
    if (!cacheOptions?.namespace)
      return hashFunction(key);
    const separator = cacheOptions.namespaceSeparator || defaultNamespaceSeparator;
    return `${cacheOptions.namespace}${separator}${hashFunction(key)}`;
  };
}
function wrapWithKeyTransformation(resolveCache, makeKey) {
  return {
    get: (key) => {
      return resolveCache().get(makeKey(key));
    },
    set: (key, value, options) => {
      return resolveCache().set(makeKey(key), value, options);
    },
    delete: (key) => {
      return resolveCache().delete(makeKey(key));
    },
    expireTag: (tag) => {
      return resolveCache().expireTag(tag);
    }
  };
}
let warnedCacheUnavailable = false;
function getCacheImplementation(debug) {
  if (!inMemoryCacheInstance) {
    inMemoryCacheInstance = new import_in_memory_cache.InMemoryCache();
  }
  if (process.env.RUNTIME_CACHE_DISABLE_BUILD_CACHE === "true") {
    debug && console.log("Using InMemoryCache as build cache is disabled");
    return inMemoryCacheInstance;
  }
  const { RUNTIME_CACHE_ENDPOINT, RUNTIME_CACHE_HEADERS } = process.env;
  if (debug) {
    console.log("Runtime cache environment variables:", {
      RUNTIME_CACHE_ENDPOINT,
      RUNTIME_CACHE_HEADERS
    });
  }
  if (!RUNTIME_CACHE_ENDPOINT || !RUNTIME_CACHE_HEADERS) {
    if (!warnedCacheUnavailable) {
      console.warn(
        "Runtime Cache unavailable in this environment. Falling back to in-memory cache."
      );
      warnedCacheUnavailable = true;
    }
    return inMemoryCacheInstance;
  }
  if (!buildCacheInstance) {
    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(RUNTIME_CACHE_HEADERS);
    } catch (e) {
      console.error("Failed to parse RUNTIME_CACHE_HEADERS:", e);
      return inMemoryCacheInstance;
    }
    buildCacheInstance = new import_build_client.BuildCache({
      endpoint: RUNTIME_CACHE_ENDPOINT,
      headers: parsedHeaders,
      onError: (error) => console.error(error)
    });
  }
  return buildCacheInstance;
}
var PkgCacheState = /* @__PURE__ */ ((PkgCacheState2) => {
  PkgCacheState2["Fresh"] = "fresh";
  PkgCacheState2["Stale"] = "stale";
  PkgCacheState2["Expired"] = "expired";
  PkgCacheState2["NotFound"] = "notFound";
  PkgCacheState2["Error"] = "error";
  return PkgCacheState2;
})(PkgCacheState || {});
const HEADERS_VERCEL_CACHE_STATE = "x-vercel-cache-state";
const HEADERS_VERCEL_REVALIDATE = "x-vercel-revalidate";
const HEADERS_VERCEL_CACHE_TAGS = "x-vercel-cache-tags";
const HEADERS_VERCEL_CACHE_ITEM_NAME = "x-vercel-cache-item-name";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HEADERS_VERCEL_CACHE_ITEM_NAME,
  HEADERS_VERCEL_CACHE_STATE,
  HEADERS_VERCEL_CACHE_TAGS,
  HEADERS_VERCEL_REVALIDATE,
  PkgCacheState,
  getCache
});
