import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { VerifyMacRequest, VerifyMacResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface VerifyMacCommandInput extends VerifyMacRequest {}
export interface VerifyMacCommandOutput
  extends VerifyMacResponse,
    __MetadataBearer {}
declare const VerifyMacCommand_base: {
  new (
    input: VerifyMacCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    VerifyMacCommandInput,
    VerifyMacCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: VerifyMacCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    VerifyMacCommandInput,
    VerifyMacCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class VerifyMacCommand extends VerifyMacCommand_base {
  protected static __types: {
    api: {
      input: VerifyMacRequest;
      output: VerifyMacResponse;
    };
    sdk: {
      input: VerifyMacCommandInput;
      output: VerifyMacCommandOutput;
    };
  };
}
