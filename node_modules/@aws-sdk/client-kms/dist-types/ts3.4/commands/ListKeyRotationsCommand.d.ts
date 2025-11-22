import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  ListKeyRotationsRequest,
  ListKeyRotationsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListKeyRotationsCommandInput extends ListKeyRotationsRequest {}
export interface ListKeyRotationsCommandOutput
  extends ListKeyRotationsResponse,
    __MetadataBearer {}
declare const ListKeyRotationsCommand_base: {
  new (
    input: ListKeyRotationsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListKeyRotationsCommandInput,
    ListKeyRotationsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListKeyRotationsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListKeyRotationsCommandInput,
    ListKeyRotationsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListKeyRotationsCommand extends ListKeyRotationsCommand_base {
  protected static __types: {
    api: {
      input: ListKeyRotationsRequest;
      output: ListKeyRotationsResponse;
    };
    sdk: {
      input: ListKeyRotationsCommandInput;
      output: ListKeyRotationsCommandOutput;
    };
  };
}
