import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { DisableKeyRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DisableKeyCommandInput extends DisableKeyRequest {}
export interface DisableKeyCommandOutput extends __MetadataBearer {}
declare const DisableKeyCommand_base: {
  new (
    input: DisableKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisableKeyCommandInput,
    DisableKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DisableKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisableKeyCommandInput,
    DisableKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DisableKeyCommand extends DisableKeyCommand_base {
  protected static __types: {
    api: {
      input: DisableKeyRequest;
      output: {};
    };
    sdk: {
      input: DisableKeyCommandInput;
      output: DisableKeyCommandOutput;
    };
  };
}
