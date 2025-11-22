import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { CreateKeyRequest, CreateKeyResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateKeyCommandInput extends CreateKeyRequest {}
export interface CreateKeyCommandOutput
  extends CreateKeyResponse,
    __MetadataBearer {}
declare const CreateKeyCommand_base: {
  new (
    input: CreateKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateKeyCommandInput,
    CreateKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [CreateKeyCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    CreateKeyCommandInput,
    CreateKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateKeyCommand extends CreateKeyCommand_base {
  protected static __types: {
    api: {
      input: CreateKeyRequest;
      output: CreateKeyResponse;
    };
    sdk: {
      input: CreateKeyCommandInput;
      output: CreateKeyCommandOutput;
    };
  };
}
