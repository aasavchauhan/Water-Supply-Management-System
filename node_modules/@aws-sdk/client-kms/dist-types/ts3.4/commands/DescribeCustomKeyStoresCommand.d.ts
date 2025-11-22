import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  DescribeCustomKeyStoresRequest,
  DescribeCustomKeyStoresResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeCustomKeyStoresCommandInput
  extends DescribeCustomKeyStoresRequest {}
export interface DescribeCustomKeyStoresCommandOutput
  extends DescribeCustomKeyStoresResponse,
    __MetadataBearer {}
declare const DescribeCustomKeyStoresCommand_base: {
  new (
    input: DescribeCustomKeyStoresCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeCustomKeyStoresCommandInput,
    DescribeCustomKeyStoresCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [DescribeCustomKeyStoresCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeCustomKeyStoresCommandInput,
    DescribeCustomKeyStoresCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeCustomKeyStoresCommand extends DescribeCustomKeyStoresCommand_base {
  protected static __types: {
    api: {
      input: DescribeCustomKeyStoresRequest;
      output: DescribeCustomKeyStoresResponse;
    };
    sdk: {
      input: DescribeCustomKeyStoresCommandInput;
      output: DescribeCustomKeyStoresCommandOutput;
    };
  };
}
