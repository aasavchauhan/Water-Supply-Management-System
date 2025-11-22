import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  ListResourceTagsRequest,
  ListResourceTagsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListResourceTagsCommandInput extends ListResourceTagsRequest {}
export interface ListResourceTagsCommandOutput
  extends ListResourceTagsResponse,
    __MetadataBearer {}
declare const ListResourceTagsCommand_base: {
  new (
    input: ListResourceTagsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListResourceTagsCommandInput,
    ListResourceTagsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListResourceTagsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListResourceTagsCommandInput,
    ListResourceTagsCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListResourceTagsCommand extends ListResourceTagsCommand_base {
  protected static __types: {
    api: {
      input: ListResourceTagsRequest;
      output: ListResourceTagsResponse;
    };
    sdk: {
      input: ListResourceTagsCommandInput;
      output: ListResourceTagsCommandOutput;
    };
  };
}
