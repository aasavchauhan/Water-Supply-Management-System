import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  DeriveSharedSecretRequest,
  DeriveSharedSecretResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeriveSharedSecretCommandInput
  extends DeriveSharedSecretRequest {}
export interface DeriveSharedSecretCommandOutput
  extends DeriveSharedSecretResponse,
    __MetadataBearer {}
declare const DeriveSharedSecretCommand_base: {
  new (
    input: DeriveSharedSecretCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeriveSharedSecretCommandInput,
    DeriveSharedSecretCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeriveSharedSecretCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeriveSharedSecretCommandInput,
    DeriveSharedSecretCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeriveSharedSecretCommand extends DeriveSharedSecretCommand_base {
  protected static __types: {
    api: {
      input: DeriveSharedSecretRequest;
      output: DeriveSharedSecretResponse;
    };
    sdk: {
      input: DeriveSharedSecretCommandInput;
      output: DeriveSharedSecretCommandOutput;
    };
  };
}
