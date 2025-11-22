import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { EncryptRequest, EncryptResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface EncryptCommandInput extends EncryptRequest {}
export interface EncryptCommandOutput
  extends EncryptResponse,
    __MetadataBearer {}
declare const EncryptCommand_base: {
  new (input: EncryptCommandInput): import("@smithy/smithy-client").CommandImpl<
    EncryptCommandInput,
    EncryptCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (input: EncryptCommandInput): import("@smithy/smithy-client").CommandImpl<
    EncryptCommandInput,
    EncryptCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class EncryptCommand extends EncryptCommand_base {
  protected static __types: {
    api: {
      input: EncryptRequest;
      output: EncryptResponse;
    };
    sdk: {
      input: EncryptCommandInput;
      output: EncryptCommandOutput;
    };
  };
}
