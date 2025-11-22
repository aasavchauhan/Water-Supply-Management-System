import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { PutKeyPolicyRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutKeyPolicyCommandInput extends PutKeyPolicyRequest {}
export interface PutKeyPolicyCommandOutput extends __MetadataBearer {}
declare const PutKeyPolicyCommand_base: {
  new (
    input: PutKeyPolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutKeyPolicyCommandInput,
    PutKeyPolicyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PutKeyPolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutKeyPolicyCommandInput,
    PutKeyPolicyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutKeyPolicyCommand extends PutKeyPolicyCommand_base {
  protected static __types: {
    api: {
      input: PutKeyPolicyRequest;
      output: {};
    };
    sdk: {
      input: PutKeyPolicyCommandInput;
      output: PutKeyPolicyCommandOutput;
    };
  };
}
