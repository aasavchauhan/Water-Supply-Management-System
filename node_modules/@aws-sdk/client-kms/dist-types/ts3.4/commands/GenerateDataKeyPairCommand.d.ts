import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  GenerateDataKeyPairRequest,
  GenerateDataKeyPairResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GenerateDataKeyPairCommandInput
  extends GenerateDataKeyPairRequest {}
export interface GenerateDataKeyPairCommandOutput
  extends GenerateDataKeyPairResponse,
    __MetadataBearer {}
declare const GenerateDataKeyPairCommand_base: {
  new (
    input: GenerateDataKeyPairCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyPairCommandInput,
    GenerateDataKeyPairCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GenerateDataKeyPairCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyPairCommandInput,
    GenerateDataKeyPairCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GenerateDataKeyPairCommand extends GenerateDataKeyPairCommand_base {
  protected static __types: {
    api: {
      input: GenerateDataKeyPairRequest;
      output: GenerateDataKeyPairResponse;
    };
    sdk: {
      input: GenerateDataKeyPairCommandInput;
      output: GenerateDataKeyPairCommandOutput;
    };
  };
}
