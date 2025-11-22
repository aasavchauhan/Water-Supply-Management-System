import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { EnableKeyRotationRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface EnableKeyRotationCommandInput
  extends EnableKeyRotationRequest {}
export interface EnableKeyRotationCommandOutput extends __MetadataBearer {}
declare const EnableKeyRotationCommand_base: {
  new (
    input: EnableKeyRotationCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    EnableKeyRotationCommandInput,
    EnableKeyRotationCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: EnableKeyRotationCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    EnableKeyRotationCommandInput,
    EnableKeyRotationCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class EnableKeyRotationCommand extends EnableKeyRotationCommand_base {
  protected static __types: {
    api: {
      input: EnableKeyRotationRequest;
      output: {};
    };
    sdk: {
      input: EnableKeyRotationCommandInput;
      output: EnableKeyRotationCommandOutput;
    };
  };
}
