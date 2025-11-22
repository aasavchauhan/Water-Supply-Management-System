"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var aws_credentials_provider_exports = {};
__export(aws_credentials_provider_exports, {
  awsCredentialsProvider: () => awsCredentialsProvider
});
module.exports = __toCommonJS(aws_credentials_provider_exports);
var import_oidc = require("@vercel/oidc");
async function loadAwsCredentialProviderWebIdentity() {
  try {
    return await import("@aws-sdk/credential-provider-web-identity");
  } catch (err) {
    throw new Error(
      "package '@aws-sdk/credential-provider-web-identity' not found"
    );
  }
}
function awsCredentialsProvider(init) {
  return async () => {
    const { fromWebToken } = await loadAwsCredentialProviderWebIdentity();
    return fromWebToken({
      ...init,
      webIdentityToken: (0, import_oidc.getVercelOidcTokenSync)()
    })();
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  awsCredentialsProvider
});
