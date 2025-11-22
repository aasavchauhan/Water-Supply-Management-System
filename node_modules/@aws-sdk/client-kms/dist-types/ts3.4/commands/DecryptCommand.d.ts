import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { DecryptRequest, DecryptResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DecryptCommandInput extends DecryptRequest {}
export interface DecryptCommandOutput
  extends DecryptResponse,
    __MetadataBearer {}
declare const DecryptCommand_base: {
  new (input: DecryptCommandInput): import("@smithy/smithy-client").CommandImpl<
    DecryptCommandInput,
    DecryptCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (input: DecryptCommandInput): import("@smithy/smithy-client").CommandImpl<
    DecryptCommandInput,
    DecryptCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DecryptCommand extends DecryptCommand_base {
  protected static __types: {
    api: {
      input: DecryptRequest;
      output: DecryptResponse;
    };
    sdk: {
      input: DecryptCommandInput;
      output: DecryptCommandOutput;
    };
  };
}
