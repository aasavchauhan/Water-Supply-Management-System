import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  RotateKeyOnDemandRequest,
  RotateKeyOnDemandResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface RotateKeyOnDemandCommandInput
  extends RotateKeyOnDemandRequest {}
export interface RotateKeyOnDemandCommandOutput
  extends RotateKeyOnDemandResponse,
    __MetadataBearer {}
declare const RotateKeyOnDemandCommand_base: {
  new (
    input: RotateKeyOnDemandCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RotateKeyOnDemandCommandInput,
    RotateKeyOnDemandCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: RotateKeyOnDemandCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RotateKeyOnDemandCommandInput,
    RotateKeyOnDemandCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class RotateKeyOnDemandCommand extends RotateKeyOnDemandCommand_base {
  protected static __types: {
    api: {
      input: RotateKeyOnDemandRequest;
      output: RotateKeyOnDemandResponse;
    };
    sdk: {
      input: RotateKeyOnDemandCommandInput;
      output: RotateKeyOnDemandCommandOutput;
    };
  };
}
