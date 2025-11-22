import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { ListAliasesRequest, ListAliasesResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListAliasesCommandInput extends ListAliasesRequest {}
export interface ListAliasesCommandOutput
  extends ListAliasesResponse,
    __MetadataBearer {}
declare const ListAliasesCommand_base: {
  new (
    input: ListAliasesCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListAliasesCommandInput,
    ListAliasesCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListAliasesCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListAliasesCommandInput,
    ListAliasesCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListAliasesCommand extends ListAliasesCommand_base {
  protected static __types: {
    api: {
      input: ListAliasesRequest;
      output: ListAliasesResponse;
    };
    sdk: {
      input: ListAliasesCommandInput;
      output: ListAliasesCommandOutput;
    };
  };
}
