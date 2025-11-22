import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { GetPublicKeyRequest, GetPublicKeyResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetPublicKeyCommandInput extends GetPublicKeyRequest {}
export interface GetPublicKeyCommandOutput
  extends GetPublicKeyResponse,
    __MetadataBearer {}
declare const GetPublicKeyCommand_base: {
  new (
    input: GetPublicKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetPublicKeyCommandInput,
    GetPublicKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetPublicKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetPublicKeyCommandInput,
    GetPublicKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetPublicKeyCommand extends GetPublicKeyCommand_base {
  protected static __types: {
    api: {
      input: GetPublicKeyRequest;
      output: GetPublicKeyResponse;
    };
    sdk: {
      input: GetPublicKeyCommandInput;
      output: GetPublicKeyCommandOutput;
    };
  };
}
