import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  ConnectCustomKeyStoreRequest,
  ConnectCustomKeyStoreResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ConnectCustomKeyStoreCommandInput
  extends ConnectCustomKeyStoreRequest {}
export interface ConnectCustomKeyStoreCommandOutput
  extends ConnectCustomKeyStoreResponse,
    __MetadataBearer {}
declare const ConnectCustomKeyStoreCommand_base: {
  new (
    input: ConnectCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ConnectCustomKeyStoreCommandInput,
    ConnectCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ConnectCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ConnectCustomKeyStoreCommandInput,
    ConnectCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ConnectCustomKeyStoreCommand extends ConnectCustomKeyStoreCommand_base {
  protected static __types: {
    api: {
      input: ConnectCustomKeyStoreRequest;
      output: {};
    };
    sdk: {
      input: ConnectCustomKeyStoreCommandInput;
      output: ConnectCustomKeyStoreCommandOutput;
    };
  };
}
