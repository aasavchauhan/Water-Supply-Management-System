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
var db_connections_exports = {};
__export(db_connections_exports, {
  attachDatabasePool: () => attachDatabasePool,
  experimental_attachDatabasePool: () => experimental_attachDatabasePool
});
module.exports = __toCommonJS(db_connections_exports);
var import_get_context = require("../get-context");
const DEBUG = !!process.env.DEBUG;
function getIdleTimeout(dbPool) {
  if ("options" in dbPool && dbPool.options) {
    if ("idleTimeoutMillis" in dbPool.options) {
      return typeof dbPool.options.idleTimeoutMillis === "number" ? dbPool.options.idleTimeoutMillis : 1e4;
    }
    if ("maxIdleTimeMS" in dbPool.options) {
      return typeof dbPool.options.maxIdleTimeMS === "number" ? dbPool.options.maxIdleTimeMS : 0;
    }
    if ("status" in dbPool) {
      return 5e3;
    }
    if ("connect" in dbPool && "execute" in dbPool) {
      return 3e4;
    }
  }
  if ("config" in dbPool && dbPool.config) {
    if ("connectionConfig" in dbPool.config && dbPool.config.connectionConfig) {
      return dbPool.config.connectionConfig.idleTimeout || 6e4;
    }
    if ("idleTimeout" in dbPool.config) {
      return typeof dbPool.config.idleTimeout === "number" ? dbPool.config.idleTimeout : 6e4;
    }
  }
  if ("poolTimeout" in dbPool) {
    return typeof dbPool.poolTimeout === "number" ? dbPool.poolTimeout : 6e4;
  }
  if ("idleTimeout" in dbPool) {
    return typeof dbPool.idleTimeout === "number" ? dbPool.idleTimeout : 0;
  }
  return 1e4;
}
let idleTimeout = null;
let idleTimeoutResolve = () => {
};
const bootTime = Date.now();
const maximumDuration = 15 * 60 * 1e3 - 1e3;
function waitUntilIdleTimeout(dbPool) {
  if (!process.env.VERCEL_URL) {
    return;
  }
  if (idleTimeout) {
    clearTimeout(idleTimeout);
    idleTimeoutResolve();
  }
  const promise = new Promise((resolve) => {
    idleTimeoutResolve = resolve;
  });
  const waitTime = Math.min(
    getIdleTimeout(dbPool) + 100,
    maximumDuration - (Date.now() - bootTime)
  );
  idleTimeout = setTimeout(() => {
    idleTimeoutResolve?.();
    if (DEBUG) {
      console.log("Database pool idle timeout reached. Releasing connections.");
    }
  }, waitTime);
  const requestContext = (0, import_get_context.getContext)();
  if (requestContext?.waitUntil) {
    requestContext.waitUntil(promise);
  } else {
    console.warn("Pool release event triggered outside of request scope.");
  }
}
function attachDatabasePool(dbPool) {
  if (idleTimeout) {
    idleTimeoutResolve?.();
    clearTimeout(idleTimeout);
  }
  if ("on" in dbPool && dbPool.on && "options" in dbPool && "idleTimeoutMillis" in dbPool.options) {
    const pgPool = dbPool;
    pgPool.on("release", () => {
      if (DEBUG) {
        console.log("Client released from pool");
      }
      waitUntilIdleTimeout(dbPool);
    });
    return;
  } else if ("on" in dbPool && dbPool.on && "config" in dbPool && dbPool.config && "connectionConfig" in dbPool.config) {
    const mysqlPool = dbPool;
    mysqlPool.on("release", () => {
      if (DEBUG) {
        console.log("MySQL client released from pool");
      }
      waitUntilIdleTimeout(dbPool);
    });
    return;
  } else if ("on" in dbPool && dbPool.on && "config" in dbPool && dbPool.config && "idleTimeout" in dbPool.config) {
    const mysql2Pool = dbPool;
    mysql2Pool.on("release", () => {
      if (DEBUG) {
        console.log("MySQL2/MariaDB client released from pool");
      }
      waitUntilIdleTimeout(dbPool);
    });
    return;
  }
  if ("on" in dbPool && dbPool.on && "options" in dbPool && dbPool.options && "maxIdleTimeMS" in dbPool.options) {
    const mongoPool = dbPool;
    mongoPool.on("connectionCheckedOut", () => {
      if (DEBUG) {
        console.log("MongoDB connection checked out");
      }
      waitUntilIdleTimeout(dbPool);
    });
    return;
  }
  if ("on" in dbPool && dbPool.on && "options" in dbPool && dbPool.options && "socket" in dbPool.options) {
    const redisPool = dbPool;
    redisPool.on("end", () => {
      if (DEBUG) {
        console.log("Redis connection ended");
      }
      waitUntilIdleTimeout(dbPool);
    });
    return;
  }
  throw new Error("Unsupported database pool type");
}
const experimental_attachDatabasePool = attachDatabasePool;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  attachDatabasePool,
  experimental_attachDatabasePool
});
