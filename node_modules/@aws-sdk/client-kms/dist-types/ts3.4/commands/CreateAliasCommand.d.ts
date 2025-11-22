import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { CreateAliasRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateAliasCommandInput extends CreateAliasRequest {}
export interface CreateAliasCommandOutput extends __MetadataBearer {}
declare const CreateAliasCommand_base: {
  new (
    input: CreateAliasCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateAliasCommandInput,
    CreateAliasCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CreateAliasCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateAliasCommandInput,
    CreateAliasCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateAliasCommand extends CreateAliasCommand_base {
  protected static __types: {
    api: {
      input: CreateAliasRequest;
      output: {};
    };
    sdk: {
      input: CreateAliasCommandInput;
      output: CreateAliasCommandOutput;
    };
  };
}
