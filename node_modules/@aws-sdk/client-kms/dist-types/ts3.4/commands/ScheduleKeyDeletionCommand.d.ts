import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  ScheduleKeyDeletionRequest,
  ScheduleKeyDeletionResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ScheduleKeyDeletionCommandInput
  extends ScheduleKeyDeletionRequest {}
export interface ScheduleKeyDeletionCommandOutput
  extends ScheduleKeyDeletionResponse,
    __MetadataBearer {}
declare const ScheduleKeyDeletionCommand_base: {
  new (
    input: ScheduleKeyDeletionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ScheduleKeyDeletionCommandInput,
    ScheduleKeyDeletionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ScheduleKeyDeletionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ScheduleKeyDeletionCommandInput,
    ScheduleKeyDeletionCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ScheduleKeyDeletionCommand extends ScheduleKeyDeletionCommand_base {
  protected static __types: {
    api: {
      input: ScheduleKeyDeletionRequest;
      output: ScheduleKeyDeletionResponse;
    };
    sdk: {
      input: ScheduleKeyDeletionCommandInput;
      output: ScheduleKeyDeletionCommandOutput;
    };
  };
}
