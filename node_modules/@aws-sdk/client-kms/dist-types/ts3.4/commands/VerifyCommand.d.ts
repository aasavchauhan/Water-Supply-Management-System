import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { VerifyRequest, VerifyResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface VerifyCommandInput extends VerifyRequest {}
export interface VerifyCommandOutput extends VerifyResponse, __MetadataBearer {}
declare const VerifyCommand_base: {
  new (input: VerifyCommandInput): import("@smithy/smithy-client").CommandImpl<
    VerifyCommandInput,
    VerifyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (input: VerifyCommandInput): import("@smithy/smithy-client").CommandImpl<
    VerifyCommandInput,
    VerifyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class VerifyCommand extends VerifyCommand_base {
  protected static __types: {
    api: {
      input: VerifyRequest;
      output: VerifyResponse;
    };
    sdk: {
      input: VerifyCommandInput;
      output: VerifyCommandOutput;
    };
  };
}
