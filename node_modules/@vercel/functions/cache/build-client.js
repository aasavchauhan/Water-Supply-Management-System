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
var build_client_exports = {};
__export(build_client_exports, {
  BuildCache: () => BuildCache
});
module.exports = __toCommonJS(build_client_exports);
var import_index = require("./index");
class BuildCache {
  constructor({
    endpoint,
    headers,
    onError
  }) {
    this.get = async (key) => {
      try {
        const res = await fetch(`${this.endpoint}${key}`, {
          headers: this.headers,
          method: "GET"
        });
        if (res.status === 404) {
          return null;
        }
        if (res.status === 200) {
          const cacheState = res.headers.get(
            import_index.HEADERS_VERCEL_CACHE_STATE
          );
          if (cacheState !== import_index.PkgCacheState.Fresh) {
            res.body?.cancel?.();
            return null;
          }
          return await res.json();
        } else {
          throw new Error(`Failed to get cache: ${res.statusText}`);
        }
      } catch (error) {
        this.onError?.(error);
        return null;
      }
    };
    this.set = async (key, value, options) => {
      try {
        const optionalHeaders = {};
        if (options?.ttl) {
          optionalHeaders[import_index.HEADERS_VERCEL_REVALIDATE] = options.ttl.toString();
        }
        if (options?.tags && options.tags.length > 0) {
          optionalHeaders[import_index.HEADERS_VERCEL_CACHE_TAGS] = options.tags.join(",");
        }
        if (options?.name) {
          optionalHeaders[import_index.HEADERS_VERCEL_CACHE_ITEM_NAME] = options.name;
        }
        const res = await fetch(`${this.endpoint}${key}`, {
          method: "POST",
          headers: {
            ...this.headers,
            ...optionalHeaders
          },
          body: JSON.stringify(value)
        });
        if (res.status !== 200) {
          throw new Error(`Failed to set cache: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        this.onError?.(error);
      }
    };
    this.delete = async (key) => {
      try {
        const res = await fetch(`${this.endpoint}${key}`, {
          method: "DELETE",
          headers: this.headers
        });
        if (res.status !== 200) {
          throw new Error(`Failed to delete cache: ${res.statusText}`);
        }
      } catch (error) {
        this.onError?.(error);
      }
    };
    this.expireTag = async (tag) => {
      try {
        if (Array.isArray(tag)) {
          tag = tag.join(",");
        }
        const res = await fetch(`${this.endpoint}revalidate?tags=${tag}`, {
          method: "POST",
          headers: this.headers
        });
        if (res.status !== 200) {
          throw new Error(`Failed to revalidate tag: ${res.statusText}`);
        }
      } catch (error) {
        this.onError?.(error);
      }
    };
    this.endpoint = endpoint;
    this.headers = headers;
    this.onError = onError;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BuildCache
});
