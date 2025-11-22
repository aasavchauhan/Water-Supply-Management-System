import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  ListKeyPoliciesRequest,
  ListKeyPoliciesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListKeyPoliciesCommandInput extends ListKeyPoliciesRequest {}
export interface ListKeyPoliciesCommandOutput
  extends ListKeyPoliciesResponse,
    __MetadataBearer {}
declare const ListKeyPoliciesCommand_base: {
  new (
    input: ListKeyPoliciesCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListKeyPoliciesCommandInput,
    ListKeyPoliciesCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListKeyPoliciesCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListKeyPoliciesCommandInput,
    ListKeyPoliciesCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListKeyPoliciesCommand extends ListKeyPoliciesCommand_base {
  protected static __types: {
    api: {
      input: ListKeyPoliciesRequest;
      output: ListKeyPoliciesResponse;
    };
    sdk: {
      input: ListKeyPoliciesCommandInput;
      output: ListKeyPoliciesCommandOutput;
    };
  };
}
