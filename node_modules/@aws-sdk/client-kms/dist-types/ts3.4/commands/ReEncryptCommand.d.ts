import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { ReEncryptRequest, ReEncryptResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ReEncryptCommandInput extends ReEncryptRequest {}
export interface ReEncryptCommandOutput
  extends ReEncryptResponse,
    __MetadataBearer {}
declare const ReEncryptCommand_base: {
  new (
    input: ReEncryptCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ReEncryptCommandInput,
    ReEncryptCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ReEncryptCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ReEncryptCommandInput,
    ReEncryptCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ReEncryptCommand extends ReEncryptCommand_base {
  protected static __types: {
    api: {
      input: ReEncryptRequest;
      output: ReEncryptResponse;
    };
    sdk: {
      input: ReEncryptCommandInput;
      output: ReEncryptCommandOutput;
    };
  };
}
