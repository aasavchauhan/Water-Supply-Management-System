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
var type_assertion_exports = {};
__export(type_assertion_exports, {
  cassandraSubtypeCheck: () => cassandraSubtypeCheck,
  ioredisSubtypeCheck: () => ioredisSubtypeCheck,
  mariadbSubtypeCheck: () => mariadbSubtypeCheck,
  mongoSubtypeCheck: () => mongoSubtypeCheck,
  mysql2SubtypeCheck: () => mysql2SubtypeCheck,
  pgSubtypeCheck: () => pgSubtypeCheck
});
module.exports = __toCommonJS(type_assertion_exports);
const pgSubtypeCheck = (pool) => pool;
const mysql2SubtypeCheck = (pool) => pool;
const mariadbSubtypeCheck = (pool) => pool;
const mongoSubtypeCheck = (client) => client;
const ioredisSubtypeCheck = (redis) => redis;
const cassandraSubtypeCheck = (client) => client;
throw new Error("This file is not used in the codebase.");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cassandraSubtypeCheck,
  ioredisSubtypeCheck,
  mariadbSubtypeCheck,
  mongoSubtypeCheck,
  mysql2SubtypeCheck,
  pgSubtypeCheck
});
