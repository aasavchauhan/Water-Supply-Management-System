import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  GetParametersForImportRequest,
  GetParametersForImportResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetParametersForImportCommandInput
  extends GetParametersForImportRequest {}
export interface GetParametersForImportCommandOutput
  extends GetParametersForImportResponse,
    __MetadataBearer {}
declare const GetParametersForImportCommand_base: {
  new (
    input: GetParametersForImportCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetParametersForImportCommandInput,
    GetParametersForImportCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetParametersForImportCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetParametersForImportCommandInput,
    GetParametersForImportCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetParametersForImportCommand extends GetParametersForImportCommand_base {
  protected static __types: {
    api: {
      input: GetParametersForImportRequest;
      output: GetParametersForImportResponse;
    };
    sdk: {
      input: GetParametersForImportCommandInput;
      output: GetParametersForImportCommandOutput;
    };
  };
}
