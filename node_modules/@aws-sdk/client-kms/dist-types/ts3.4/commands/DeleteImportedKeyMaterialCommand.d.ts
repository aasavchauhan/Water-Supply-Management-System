import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KMSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KMSClient";
import {
  DeleteImportedKeyMaterialRequest,
  DeleteImportedKeyMaterialResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteImportedKeyMaterialCommandInput
  extends DeleteImportedKeyMaterialRequest {}
export interface DeleteImportedKeyMaterialCommandOutput
  extends DeleteImportedKeyMaterialResponse,
    __MetadataBearer {}
declare const DeleteImportedKeyMaterialCommand_base: {
  new (
    input: DeleteImportedKeyMaterialCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteImportedKeyMaterialCommandInput,
    DeleteImportedKeyMaterialCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteImportedKeyMaterialCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteImportedKeyMaterialCommandInput,
    DeleteImportedKeyMaterialCommandOutput,
    KMSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteImportedKeyMaterialCommand extends DeleteImportedKeyMaterialCommand_base {
  protected static __types: {
    api: {
      input: DeleteImportedKeyMaterialRequest;
      output: DeleteImportedKeyMaterialResponse;
    };
    sdk: {
      input: DeleteImportedKeyMaterialCommandInput;
      output: DeleteImportedKeyMaterialCommandOutput;
    };
  };
}
