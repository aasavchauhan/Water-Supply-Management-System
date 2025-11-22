import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { ListKeysRequest, ListKeysResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListKeysCommandInput extends ListKeysRequest {}
export interface ListKeysCommandOutput
  extends ListKeysResponse,
    __MetadataBearer {}
declare const ListKeysCommand_base: {
  new (
    input: ListKeysCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListKeysCommandInput,
    ListKeysCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListKeysCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListKeysCommandInput,
    ListKeysCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListKeysCommand extends ListKeysCommand_base {
  protected static __types: {
    api: {
      input: ListKeysRequest;
      output: ListKeysResponse;
    };
    sdk: {
      input: ListKeysCommandInput;
      output: ListKeysCommandOutput;
    };
  };
}
