import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  GenerateRandomRequest,
  GenerateRandomResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GenerateRandomCommandInput extends GenerateRandomRequest {}
export interface GenerateRandomCommandOutput
  extends GenerateRandomResponse,
    __MetadataBearer {}
declare const GenerateRandomCommand_base: {
  new (
    input: GenerateRandomCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateRandomCommandInput,
    GenerateRandomCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [GenerateRandomCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    GenerateRandomCommandInput,
    GenerateRandomCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GenerateRandomCommand extends GenerateRandomCommand_base {
  protected static __types: {
    api: {
      input: GenerateRandomRequest;
      output: GenerateRandomResponse;
    };
    sdk: {
      input: GenerateRandomCommandInput;
      output: GenerateRandomCommandOutput;
    };
  };
}
