import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { RetireGrantRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface RetireGrantCommandInput extends RetireGrantRequest {}
export interface RetireGrantCommandOutput extends __MetadataBearer {}
declare const RetireGrantCommand_base: {
  new (
    input: RetireGrantCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RetireGrantCommandInput,
    RetireGrantCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [RetireGrantCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    RetireGrantCommandInput,
    RetireGrantCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class RetireGrantCommand extends RetireGrantCommand_base {
  protected static __types: {
    api: {
      input: RetireGrantRequest;
      output: {};
    };
    sdk: {
      input: RetireGrantCommandInput;
      output: RetireGrantCommandOutput;
    };
  };
}
