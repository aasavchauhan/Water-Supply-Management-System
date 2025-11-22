import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  DisconnectCustomKeyStoreRequest,
  DisconnectCustomKeyStoreResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DisconnectCustomKeyStoreCommandInput
  extends DisconnectCustomKeyStoreRequest {}
export interface DisconnectCustomKeyStoreCommandOutput
  extends DisconnectCustomKeyStoreResponse,
    __MetadataBearer {}
declare const DisconnectCustomKeyStoreCommand_base: {
  new (
    input: DisconnectCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisconnectCustomKeyStoreCommandInput,
    DisconnectCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DisconnectCustomKeyStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisconnectCustomKeyStoreCommandInput,
    DisconnectCustomKeyStoreCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DisconnectCustomKeyStoreCommand extends DisconnectCustomKeyStoreCommand_base {
  protected static __types: {
    api: {
      input: DisconnectCustomKeyStoreRequest;
      output: {};
    };
    sdk: {
      input: DisconnectCustomKeyStoreCommandInput;
      output: DisconnectCustomKeyStoreCommandOutput;
    };
  };
}
