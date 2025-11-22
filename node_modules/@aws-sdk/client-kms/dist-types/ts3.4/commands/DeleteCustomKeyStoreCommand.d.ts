import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  DeleteCustomKeyStoreRequest,
  DeleteCustomKeyStoreResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteCustomKeyStoreCommandInput
  extends DeleteCustomKeyStoreRequest {}
export interface DeleteCustomKeyStoreCommandOutput
  extends DeleteCustomKeyStoreResponse,
    __MetadataBearer {}
declare const DeleteCustomKeyStoreCommand_base: {
  new (
    input: DeleteCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteCustomKeyStoreCommandInput,
    DeleteCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteCustomKeyStoreCommandInput,
    DeleteCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteCustomKeyStoreCommand extends DeleteCustomKeyStoreCommand_base {
  protected static __types: {
    api: {
      input: DeleteCustomKeyStoreRequest;
      output: {};
    };
    sdk: {
      input: DeleteCustomKeyStoreCommandInput;
      output: DeleteCustomKeyStoreCommandOutput;
    };
  };
}
