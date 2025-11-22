import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import { DescribeKeyRequest, DescribeKeyResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeKeyCommandInput extends DescribeKeyRequest {}
export interface DescribeKeyCommandOutput
  extends DescribeKeyResponse,
    __MetadataBearer {}
declare const DescribeKeyCommand_base: {
  new (
    input: DescribeKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeKeyCommandInput,
    DescribeKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DescribeKeyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeKeyCommandInput,
    DescribeKeyCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeKeyCommand extends DescribeKeyCommand_base {
  protected static __types: {
    api: {
      input: DescribeKeyRequest;
      output: DescribeKeyResponse;
    };
    sdk: {
      input: DescribeKeyCommandInput;
      output: DescribeKeyCommandOutput;
    };
  };
}
