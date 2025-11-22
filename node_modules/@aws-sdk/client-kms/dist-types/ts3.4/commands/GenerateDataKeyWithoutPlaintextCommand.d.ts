import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  GenerateDataKeyWithoutPlaintextRequest,
  GenerateDataKeyWithoutPlaintextResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GenerateDataKeyWithoutPlaintextCommandInput
  extends GenerateDataKeyWithoutPlaintextRequest {}
export interface GenerateDataKeyWithoutPlaintextCommandOutput
  extends GenerateDataKeyWithoutPlaintextResponse,
    __MetadataBearer {}
declare const GenerateDataKeyWithoutPlaintextCommand_base: {
  new (
    input: GenerateDataKeyWithoutPlaintextCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyWithoutPlaintextCommandInput,
    GenerateDataKeyWithoutPlaintextCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GenerateDataKeyWithoutPlaintextCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyWithoutPlaintextCommandInput,
    GenerateDataKeyWithoutPlaintextCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GenerateDataKeyWithoutPlaintextCommand extends GenerateDataKeyWithoutPlaintextCommand_base {
  protected static __types: {
    api: {
      input: GenerateDataKeyWithoutPlaintextRequest;
      output: GenerateDataKeyWithoutPlaintextResponse;
    };
    sdk: {
      input: GenerateDataKeyWithoutPlaintextCommandInput;
      output: GenerateDataKeyWithoutPlaintextCommandOutput;
    };
  };
}
