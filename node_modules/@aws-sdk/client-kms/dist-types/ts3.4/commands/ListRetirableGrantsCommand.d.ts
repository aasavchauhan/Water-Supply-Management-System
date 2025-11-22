import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  ListGrantsResponse,
  ListRetirableGrantsRequest,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListRetirableGrantsCommandInput
  extends ListRetirableGrantsRequest {}
export interface ListRetirableGrantsCommandOutput
  extends ListGrantsResponse,
    __MetadataBearer {}
declare const ListRetirableGrantsCommand_base: {
  new (
    input: ListRetirableGrantsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListRetirableGrantsCommandInput,
    ListRetirableGrantsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListRetirableGrantsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListRetirableGrantsCommandInput,
    ListRetirableGrantsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListRetirableGrantsCommand extends ListRetirableGrantsCommand_base {
  protected static __types: {
    api: {
      input: ListRetirableGrantsRequest;
      output: ListGrantsResponse;
    };
    sdk: {
      input: ListRetirableGrantsCommandInput;
      output: ListRetirableGrantsCommandOutput;
    };
  };
}
