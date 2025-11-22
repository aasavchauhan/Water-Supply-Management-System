import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  CancelKeyDeletionRequest,
  CancelKeyDeletionResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CancelKeyDeletionCommandInput
  extends CancelKeyDeletionRequest {}
export interface CancelKeyDeletionCommandOutput
  extends CancelKeyDeletionResponse,
    __MetadataBearer {}
declare const CancelKeyDeletionCommand_base: {
  new (
    input: CancelKeyDeletionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CancelKeyDeletionCommandInput,
    CancelKeyDeletionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CancelKeyDeletionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CancelKeyDeletionCommandInput,
    CancelKeyDeletionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CancelKeyDeletionCommand extends CancelKeyDeletionCommand_base {
  protected static __types: {
    api: {
      input: CancelKeyDeletionRequest;
      output: CancelKeyDeletionResponse;
    };
    sdk: {
      input: CancelKeyDeletionCommandInput;
      output: CancelKeyDeletionCommandOutput;
    };
  };
}
