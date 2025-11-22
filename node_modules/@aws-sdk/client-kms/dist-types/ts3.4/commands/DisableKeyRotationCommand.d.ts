import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { DisableKeyRotationRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DisableKeyRotationCommandInput
  extends DisableKeyRotationRequest {}
export interface DisableKeyRotationCommandOutput extends __MetadataBearer {}
declare const DisableKeyRotationCommand_base: {
  new (
    input: DisableKeyRotationCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisableKeyRotationCommandInput,
    DisableKeyRotationCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DisableKeyRotationCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisableKeyRotationCommandInput,
    DisableKeyRotationCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DisableKeyRotationCommand extends DisableKeyRotationCommand_base {
  protected static __types: {
    api: {
      input: DisableKeyRotationRequest;
      output: {};
    };
    sdk: {
      input: DisableKeyRotationCommandInput;
      output: DisableKeyRotationCommandOutput;
    };
  };
}
