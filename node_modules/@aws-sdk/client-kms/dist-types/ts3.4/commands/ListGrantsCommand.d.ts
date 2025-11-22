import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { ListGrantsRequest, ListGrantsResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListGrantsCommandInput extends ListGrantsRequest {}
export interface ListGrantsCommandOutput
  extends ListGrantsResponse,
    __MetadataBearer {}
declare const ListGrantsCommand_base: {
  new (
    input: ListGrantsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListGrantsCommandInput,
    ListGrantsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListGrantsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListGrantsCommandInput,
    ListGrantsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListGrantsCommand extends ListGrantsCommand_base {
  protected static __types: {
    api: {
      input: ListGrantsRequest;
      output: ListGrantsResponse;
    };
    sdk: {
      input: ListGrantsCommandInput;
      output: ListGrantsCommandOutput;
    };
  };
}
