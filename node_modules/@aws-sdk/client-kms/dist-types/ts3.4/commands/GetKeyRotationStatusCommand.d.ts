import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  GetKeyRotationStatusRequest,
  GetKeyRotationStatusResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetKeyRotationStatusCommandInput
  extends GetKeyRotationStatusRequest {}
export interface GetKeyRotationStatusCommandOutput
  extends GetKeyRotationStatusResponse,
    __MetadataBearer {}
declare const GetKeyRotationStatusCommand_base: {
  new (
    input: GetKeyRotationStatusCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetKeyRotationStatusCommandInput,
    GetKeyRotationStatusCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetKeyRotationStatusCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetKeyRotationStatusCommandInput,
    GetKeyRotationStatusCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetKeyRotationStatusCommand extends GetKeyRotationStatusCommand_base {
  protected static __types: {
    api: {
      input: GetKeyRotationStatusRequest;
      output: GetKeyRotationStatusResponse;
    };
    sdk: {
      input: GetKeyRotationStatusCommandInput;
      output: GetKeyRotationStatusCommandOutput;
    };
  };
}
