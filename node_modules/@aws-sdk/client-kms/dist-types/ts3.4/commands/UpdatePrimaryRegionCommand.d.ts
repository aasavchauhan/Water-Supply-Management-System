import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { UpdatePrimaryRegionRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdatePrimaryRegionCommandInput
  extends UpdatePrimaryRegionRequest {}
export interface UpdatePrimaryRegionCommandOutput extends __MetadataBearer {}
declare const UpdatePrimaryRegionCommand_base: {
  new (
    input: UpdatePrimaryRegionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdatePrimaryRegionCommandInput,
    UpdatePrimaryRegionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdatePrimaryRegionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdatePrimaryRegionCommandInput,
    UpdatePrimaryRegionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdatePrimaryRegionCommand extends UpdatePrimaryRegionCommand_base {
  protected static __types: {
    api: {
      input: UpdatePrimaryRegionRequest;
      output: {};
    };
    sdk: {
      input: UpdatePrimaryRegionCommandInput;
      output: UpdatePrimaryRegionCommandOutput;
    };
  };
}
