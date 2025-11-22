import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { CreateGrantRequest, CreateGrantResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateGrantCommandInput extends CreateGrantRequest {}
export interface CreateGrantCommandOutput
  extends CreateGrantResponse,
    __MetadataBearer {}
declare const CreateGrantCommand_base: {
  new (
    input: CreateGrantCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateGrantCommandInput,
    CreateGrantCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CreateGrantCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateGrantCommandInput,
    CreateGrantCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateGrantCommand extends CreateGrantCommand_base {
  protected static __types: {
    api: {
      input: CreateGrantRequest;
      output: CreateGrantResponse;
    };
    sdk: {
      input: CreateGrantCommandInput;
      output: CreateGrantCommandOutput;
    };
  };
}
