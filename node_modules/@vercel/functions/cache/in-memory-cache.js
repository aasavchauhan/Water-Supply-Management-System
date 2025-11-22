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
var in_memory_cache_exports = {};
__export(in_memory_cache_exports, {
  InMemoryCache: () => InMemoryCache
});
module.exports = __toCommonJS(in_memory_cache_exports);
class InMemoryCache {
  constructor() {
    this.cache = {};
  }
  async get(key) {
    const entry = this.cache[key];
    if (entry) {
      if (entry.ttl && entry.lastModified + entry.ttl * 1e3 < Date.now()) {
        await this.delete(key);
        return null;
      }
      return entry.value;
    }
    return null;
  }
  async set(key, value, options) {
    this.cache[key] = {
      value,
      lastModified: Date.now(),
      ttl: options?.ttl,
      tags: new Set(options?.tags || [])
    };
  }
  async delete(key) {
    delete this.cache[key];
  }
  async expireTag(tag) {
    const tags = Array.isArray(tag) ? tag : [tag];
    for (const key in this.cache) {
      if (Object.prototype.hasOwnProperty.call(this.cache, key)) {
        const entry = this.cache[key];
        if (tags.some((t) => entry.tags.has(t))) {
          delete this.cache[key];
        }
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryCache
});
