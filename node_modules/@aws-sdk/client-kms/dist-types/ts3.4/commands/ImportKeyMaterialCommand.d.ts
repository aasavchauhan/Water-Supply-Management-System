import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  ImportKeyMaterialRequest,
  ImportKeyMaterialResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ImportKeyMaterialCommandInput
  extends ImportKeyMaterialRequest {}
export interface ImportKeyMaterialCommandOutput
  extends ImportKeyMaterialResponse,
    __MetadataBearer {}
declare const ImportKeyMaterialCommand_base: {
  new (
    input: ImportKeyMaterialCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ImportKeyMaterialCommandInput,
    ImportKeyMaterialCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ImportKeyMaterialCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ImportKeyMaterialCommandInput,
    ImportKeyMaterialCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ImportKeyMaterialCommand extends ImportKeyMaterialCommand_base {
  protected static __types: {
    api: {
      input: ImportKeyMaterialRequest;
      output: ImportKeyMaterialResponse;
    };
    sdk: {
      input: ImportKeyMaterialCommandInput;
      output: ImportKeyMaterialCommandOutput;
    };
  };
}
