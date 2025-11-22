import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { UpdateKeyDescriptionRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateKeyDescriptionCommandInput
  extends UpdateKeyDescriptionRequest {}
export interface UpdateKeyDescriptionCommandOutput extends __MetadataBearer {}
declare const UpdateKeyDescriptionCommand_base: {
  new (
    input: UpdateKeyDescriptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateKeyDescriptionCommandInput,
    UpdateKeyDescriptionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateKeyDescriptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateKeyDescriptionCommandInput,
    UpdateKeyDescriptionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateKeyDescriptionCommand extends UpdateKeyDescriptionCommand_base {
  protected static __types: {
    api: {
      input: UpdateKeyDescriptionRequest;
      output: {};
    };
    sdk: {
      input: UpdateKeyDescriptionCommandInput;
      output: UpdateKeyDescriptionCommandOutput;
    };
  };
}
