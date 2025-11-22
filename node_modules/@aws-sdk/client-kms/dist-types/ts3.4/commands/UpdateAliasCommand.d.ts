import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { UpdateAliasRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateAliasCommandInput extends UpdateAliasRequest {}
export interface UpdateAliasCommandOutput extends __MetadataBearer {}
declare const UpdateAliasCommand_base: {
  new (
    input: UpdateAliasCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateAliasCommandInput,
    UpdateAliasCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateAliasCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateAliasCommandInput,
    UpdateAliasCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateAliasCommand extends UpdateAliasCommand_base {
  protected static __types: {
    api: {
      input: UpdateAliasRequest;
      output: {};
    };
    sdk: {
      input: UpdateAliasCommandInput;
      output: UpdateAliasCommandOutput;
    };
  };
}
