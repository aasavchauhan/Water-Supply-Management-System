import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { GenerateMacRequest, GenerateMacResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GenerateMacCommandInput extends GenerateMacRequest {}
export interface GenerateMacCommandOutput
  extends GenerateMacResponse,
    __MetadataBearer {}
declare const GenerateMacCommand_base: {
  new (
    input: GenerateMacCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateMacCommandInput,
    GenerateMacCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GenerateMacCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateMacCommandInput,
    GenerateMacCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GenerateMacCommand extends GenerateMacCommand_base {
  protected static __types: {
    api: {
      input: GenerateMacRequest;
      output: GenerateMacResponse;
    };
    sdk: {
      input: GenerateMacCommandInput;
      output: GenerateMacCommandOutput;
    };
  };
}
