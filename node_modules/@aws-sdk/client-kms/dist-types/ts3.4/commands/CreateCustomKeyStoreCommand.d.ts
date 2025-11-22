import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  CreateCustomKeyStoreRequest,
  CreateCustomKeyStoreResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateCustomKeyStoreCommandInput
  extends CreateCustomKeyStoreRequest {}
export interface CreateCustomKeyStoreCommandOutput
  extends CreateCustomKeyStoreResponse,
    __MetadataBearer {}
declare const CreateCustomKeyStoreCommand_base: {
  new (
    input: CreateCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateCustomKeyStoreCommandInput,
    CreateCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CreateCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateCustomKeyStoreCommandInput,
    CreateCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateCustomKeyStoreCommand extends CreateCustomKeyStoreCommand_base {
  protected static __types: {
    api: {
      input: CreateCustomKeyStoreRequest;
      output: CreateCustomKeyStoreResponse;
    };
    sdk: {
      input: CreateCustomKeyStoreCommandInput;
      output: CreateCustomKeyStoreCommandOutput;
    };
  };
}
