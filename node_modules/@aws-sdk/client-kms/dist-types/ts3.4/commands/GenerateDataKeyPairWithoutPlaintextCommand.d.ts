import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  GenerateDataKeyPairWithoutPlaintextRequest,
  GenerateDataKeyPairWithoutPlaintextResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GenerateDataKeyPairWithoutPlaintextCommandInput
  extends GenerateDataKeyPairWithoutPlaintextRequest {}
export interface GenerateDataKeyPairWithoutPlaintextCommandOutput
  extends GenerateDataKeyPairWithoutPlaintextResponse,
    __MetadataBearer {}
declare const GenerateDataKeyPairWithoutPlaintextCommand_base: {
  new (
    input: GenerateDataKeyPairWithoutPlaintextCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyPairWithoutPlaintextCommandInput,
    GenerateDataKeyPairWithoutPlaintextCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GenerateDataKeyPairWithoutPlaintextCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyPairWithoutPlaintextCommandInput,
    GenerateDataKeyPairWithoutPlaintextCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GenerateDataKeyPairWithoutPlaintextCommand extends GenerateDataKeyPairWithoutPlaintextCommand_base {
  protected static __types: {
    api: {
      input: GenerateDataKeyPairWithoutPlaintextRequest;
      output: GenerateDataKeyPairWithoutPlaintextResponse;
    };
    sdk: {
      input: GenerateDataKeyPairWithoutPlaintextCommandInput;
      output: GenerateDataKeyPairWithoutPlaintextCommandOutput;
    };
  };
}
