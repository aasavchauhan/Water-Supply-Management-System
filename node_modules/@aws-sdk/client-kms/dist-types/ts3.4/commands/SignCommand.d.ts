import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { SignRequest, SignResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface SignCommandInput extends SignRequest {}
export interface SignCommandOutput extends SignResponse, __MetadataBearer {}
declare const SignCommand_base: {
  new (input: SignCommandInput): import("@smithy/smithy-client").CommandImpl<
    SignCommandInput,
    SignCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (input: SignCommandInput): import("@smithy/smithy-client").CommandImpl<
    SignCommandInput,
    SignCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class SignCommand extends SignCommand_base {
  protected static __types: {
    api: {
      input: SignRequest;
      output: SignResponse;
    };
    sdk: {
      input: SignCommandInput;
      output: SignCommandOutput;
    };
  };
}
