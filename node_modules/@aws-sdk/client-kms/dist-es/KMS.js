import { createAggregatedClient } from "@smithy/smithy-client";
import { CancelKeyDeletionCommand, } from "./commands/CancelKeyDeletionCommand";
import { ConnectCustomKeyStoreCommand, } from "./commands/ConnectCustomKeyStoreCommand";
import { CreateAliasCommand } from "./commands/CreateAliasCommand";
import { CreateCustomKeyStoreCommand, } from "./commands/CreateCustomKeyStoreCommand";
import { CreateGrantCommand } from "./commands/CreateGrantCommand";
import { CreateKeyCommand } from "./commands/CreateKeyCommand";
import { DecryptCommand } from "./commands/DecryptCommand";
import { DeleteAliasCommand } from "./commands/DeleteAliasCommand";
import { DeleteCustomKeyStoreCommand, } from "./commands/DeleteCustomKeyStoreCommand";
import { DeleteImportedKeyMaterialCommand, } from "./commands/DeleteImportedKeyMaterialCommand";
import { DeriveSharedSecretCommand, } from "./commands/DeriveSharedSecretCommand";
import { DescribeCustomKeyStoresCommand, } from "./commands/DescribeCustomKeyStoresCommand";
import { DescribeKeyCommand } from "./commands/DescribeKeyCommand";
import { DisableKeyCommand } from "./commands/DisableKeyCommand";
import { DisableKeyRotationCommand, } from "./commands/DisableKeyRotationCommand";
import { DisconnectCustomKeyStoreCommand, } from "./commands/DisconnectCustomKeyStoreCommand";
import { EnableKeyCommand } from "./commands/EnableKeyCommand";
import { EnableKeyRotationCommand, } from "./commands/EnableKeyRotationCommand";
import { EncryptCommand } from "./commands/EncryptCommand";
import { GenerateDataKeyCommand, } from "./commands/GenerateDataKeyCommand";
import { GenerateDataKeyPairCommand, } from "./commands/GenerateDataKeyPairCommand";
import { GenerateDataKeyPairWithoutPlaintextCommand, } from "./commands/GenerateDataKeyPairWithoutPlaintextCommand";
import { GenerateDataKeyWithoutPlaintextCommand, } from "./commands/GenerateDataKeyWithoutPlaintextCommand";
import { GenerateMacCommand } from "./commands/GenerateMacCommand";
import { GenerateRandomCommand, } from "./commands/GenerateRandomCommand";
import { GetKeyPolicyCommand, } from "./commands/GetKeyPolicyCommand";
import { GetKeyRotationStatusCommand, } from "./commands/GetKeyRotationStatusCommand";
import { GetParametersForImportCommand, } from "./commands/GetParametersForImportCommand";
import { GetPublicKeyCommand, } from "./commands/GetPublicKeyCommand";
import { ImportKeyMaterialCommand, } from "./commands/ImportKeyMaterialCommand";
import { ListAliasesCommand } from "./commands/ListAliasesCommand";
import { ListGrantsCommand } from "./commands/ListGrantsCommand";
import { ListKeyPoliciesCommand, } from "./commands/ListKeyPoliciesCommand";
import { ListKeyRotationsCommand, } from "./commands/ListKeyRotationsCommand";
import { ListKeysCommand } from "./commands/ListKeysCommand";
import { ListResourceTagsCommand, } from "./commands/ListResourceTagsCommand";
import { ListRetirableGrantsCommand, } from "./commands/ListRetirableGrantsCommand";
import { PutKeyPolicyCommand, } from "./commands/PutKeyPolicyCommand";
import { ReEncryptCommand } from "./commands/ReEncryptCommand";
import { ReplicateKeyCommand, } from "./commands/ReplicateKeyCommand";
import { RetireGrantCommand } from "./commands/RetireGrantCommand";
import { RevokeGrantCommand } from "./commands/RevokeGrantCommand";
import { RotateKeyOnDemandCommand, } from "./commands/RotateKeyOnDemandCommand";
import { ScheduleKeyDeletionCommand, } from "./commands/ScheduleKeyDeletionCommand";
import { SignCommand } from "./commands/SignCommand";
import { TagResourceCommand } from "./commands/TagResourceCommand";
import { UntagResourceCommand, } from "./commands/UntagResourceCommand";
import { UpdateAliasCommand } from "./commands/UpdateAliasCommand";
import { UpdateCustomKeyStoreCommand, } from "./commands/UpdateCustomKeyStoreCommand";
import { UpdateKeyDescriptionCommand, } from "./commands/UpdateKeyDescriptionCommand";
import { UpdatePrimaryRegionCommand, } from "./commands/UpdatePrimaryRegionCommand";
import { VerifyCommand } from "./commands/VerifyCommand";
import { VerifyMacCommand } from "./commands/VerifyMacCommand";
import { KMSClient } from "./KMSClient";
const commands = {
    CancelKeyDeletionCommand,
    ConnectCustomKeyStoreCommand,
    CreateAliasCommand,
    CreateCustomKeyStoreCommand,
    CreateGrantCommand,
    CreateKeyCommand,
    DecryptCommand,
    DeleteAliasCommand,
    DeleteCustomKeyStoreCommand,
    DeleteImportedKeyMaterialCommand,
    DeriveSharedSecretCommand,
    DescribeCustomKeyStoresCommand,
    DescribeKeyCommand,
    DisableKeyCommand,
    DisableKeyRotationCommand,
    DisconnectCustomKeyStoreCommand,
    EnableKeyCommand,
    EnableKeyRotationCommand,
    EncryptCommand,
    GenerateDataKeyCommand,
    GenerateDataKeyPairCommand,
    GenerateDataKeyPairWithoutPlaintextCommand,
    GenerateDataKeyWithoutPlaintextCommand,
    GenerateMacCommand,
    GenerateRandomCommand,
    GetKeyPolicyCommand,
    GetKeyRotationStatusCommand,
    GetParametersForImportCommand,
    GetPublicKeyCommand,
    ImportKeyMaterialCommand,
    ListAliasesCommand,
    ListGrantsCommand,
    ListKeyPoliciesCommand,
    ListKeyRotationsCommand,
    ListKeysCommand,
    ListResourceTagsCommand,
    ListRetirableGrantsCommand,
    PutKeyPolicyCommand,
    ReEncryptCommand,
    ReplicateKeyCommand,
    RetireGrantCommand,
    RevokeGrantCommand,
    RotateKeyOnDemandCommand,
    ScheduleKeyDeletionCommand,
    SignCommand,
    TagResourceCommand,
    UntagResourceCommand,
    UpdateAliasCommand,
    UpdateCustomKeyStoreCommand,
    UpdateKeyDescriptionCommand,
    UpdatePrimaryRegionCommand,
    VerifyCommand,
    VerifyMacCommand,
};
export class KMS extends KMSClient {
}
createAggregatedClient(commands, KMS);
