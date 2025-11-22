import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  GenerateDataKeyRequest,
  GenerateDataKeyResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GenerateDataKeyCommandInput extends GenerateDataKeyRequest {}
export interface GenerateDataKeyCommandOutput
  extends GenerateDataKeyResponse,
    __MetadataBearer {}
declare const GenerateDataKeyCommand_base: {
  new (
    input: GenerateDataKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyCommandInput,
    GenerateDataKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GenerateDataKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateDataKeyCommandInput,
    GenerateDataKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GenerateDataKeyCommand extends GenerateDataKeyCommand_base {
  protected static __types: {
    api: {
      input: GenerateDataKeyRequest;
      output: GenerateDataKeyResponse;
    };
    sdk: {
      input: GenerateDataKeyCommandInput;
      output: GenerateDataKeyCommandOutput;
    };
  };
}
