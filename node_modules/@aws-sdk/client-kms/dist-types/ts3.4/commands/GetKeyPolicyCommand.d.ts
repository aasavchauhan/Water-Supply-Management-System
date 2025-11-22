import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { GetKeyPolicyRequest, GetKeyPolicyResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetKeyPolicyCommandInput extends GetKeyPolicyRequest {}
export interface GetKeyPolicyCommandOutput
  extends GetKeyPolicyResponse,
    __MetadataBearer {}
declare const GetKeyPolicyCommand_base: {
  new (
    input: GetKeyPolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetKeyPolicyCommandInput,
    GetKeyPolicyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetKeyPolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetKeyPolicyCommandInput,
    GetKeyPolicyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetKeyPolicyCommand extends GetKeyPolicyCommand_base {
  protected static __types: {
    api: {
      input: GetKeyPolicyRequest;
      output: GetKeyPolicyResponse;
    };
    sdk: {
      input: GetKeyPolicyCommandInput;
      output: GetKeyPolicyCommandOutput;
    };
  };
}
