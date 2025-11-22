import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { ReplicateKeyRequest, ReplicateKeyResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ReplicateKeyCommandInput extends ReplicateKeyRequest {}
export interface ReplicateKeyCommandOutput
  extends ReplicateKeyResponse,
    __MetadataBearer {}
declare const ReplicateKeyCommand_base: {
  new (
    input: ReplicateKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ReplicateKeyCommandInput,
    ReplicateKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ReplicateKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ReplicateKeyCommandInput,
    ReplicateKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ReplicateKeyCommand extends ReplicateKeyCommand_base {
  protected static __types: {
    api: {
      input: ReplicateKeyRequest;
      output: ReplicateKeyResponse;
    };
    sdk: {
      input: ReplicateKeyCommandInput;
      output: ReplicateKeyCommandOutput;
    };
  };
}
