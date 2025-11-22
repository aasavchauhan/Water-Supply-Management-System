import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  UpdateCustomKeyStoreRequest,
  UpdateCustomKeyStoreResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateCustomKeyStoreCommandInput
  extends UpdateCustomKeyStoreRequest {}
export interface UpdateCustomKeyStoreCommandOutput
  extends UpdateCustomKeyStoreResponse,
    __MetadataBearer {}
declare const UpdateCustomKeyStoreCommand_base: {
  new (
    input: UpdateCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateCustomKeyStoreCommandInput,
    UpdateCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateCustomKeyStoreCommandInput,
    UpdateCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateCustomKeyStoreCommand extends UpdateCustomKeyStoreCommand_base {
  protected static __types: {
    api: {
      input: UpdateCustomKeyStoreRequest;
      output: {};
    };
    sdk: {
      input: UpdateCustomKeyStoreCommandInput;
      output: UpdateCustomKeyStoreCommandOutput;
    };
  };
}
