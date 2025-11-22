import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { EnableKeyRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface EnableKeyCommandInput extends EnableKeyRequest {}
export interface EnableKeyCommandOutput extends __MetadataBearer {}
declare const EnableKeyCommand_base: {
  new (
    input: EnableKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    EnableKeyCommandInput,
    EnableKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: EnableKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    EnableKeyCommandInput,
    EnableKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class EnableKeyCommand extends EnableKeyCommand_base {
  protected static __types: {
    api: {
      input: EnableKeyRequest;
      output: {};
    };
    sdk: {
      input: EnableKeyCommandInput;
      output: EnableKeyCommandOutput;
    };
  };
}
