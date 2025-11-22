import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { RevokeGrantRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface RevokeGrantCommandInput extends RevokeGrantRequest {}
export interface RevokeGrantCommandOutput extends __MetadataBearer {}
declare const RevokeGrantCommand_base: {
  new (
    input: RevokeGrantCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RevokeGrantCommandInput,
    RevokeGrantCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: RevokeGrantCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RevokeGrantCommandInput,
    RevokeGrantCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class RevokeGrantCommand extends RevokeGrantCommand_base {
  protected static __types: {
    api: {
      input: RevokeGrantRequest;
      output: {};
    };
    sdk: {
      input: RevokeGrantCommandInput;
      output: RevokeGrantCommandOutput;
    };
  };
}
