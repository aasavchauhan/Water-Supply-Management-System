import { HttpHandlerOptions as __HttpHandlerOptions } from "@smithy/types";
import {
  CancelKeyDeletionCommandInput,
  CancelKeyDeletionCommandOutput,
} from "./commands/CancelKeyDeletionCommand";
import {
  ConnectCustomKeyStoreCommandInput,
  ConnectCustomKeyStoreCommandOutput,
} from "./commands/ConnectCustomKeyStoreCommand";
import {
  CreateAliasCommandInput,
  CreateAliasCommandOutput,
} from "./commands/CreateAliasCommand";
import {
  CreateCustomKeyStoreCommandInput,
  CreateCustomKeyStoreCommandOutput,
} from "./commands/CreateCustomKeyStoreCommand";
import {
  CreateGrantCommandInput,
  CreateGrantCommandOutput,
} from "./commands/CreateGrantCommand";
import {
  CreateKeyCommandInput,
  CreateKeyCommandOutput,
} from "./commands/CreateKeyCommand";
import {
  DecryptCommandInput,
  DecryptCommandOutput,
} from "./commands/DecryptCommand";
import {
  DeleteAliasCommandInput,
  DeleteAliasCommandOutput,
} from "./commands/DeleteAliasCommand";
import {
  DeleteCustomKeyStoreCommandInput,
  DeleteCustomKeyStoreCommandOutput,
} from "./commands/DeleteCustomKeyStoreCommand";
import {
  DeleteImportedKeyMaterialCommandInput,
  DeleteImportedKeyMaterialCommandOutput,
} from "./commands/DeleteImportedKeyMaterialCommand";
import {
  DeriveSharedSecretCommandInput,
  DeriveSharedSecretCommandOutput,
} from "./commands/DeriveSharedSecretCommand";
import {
  DescribeCustomKeyStoresCommandInput,
  DescribeCustomKeyStoresCommandOutput,
} from "./commands/DescribeCustomKeyStoresCommand";
import {
  DescribeKeyCommandInput,
  DescribeKeyCommandOutput,
} from "./commands/DescribeKeyCommand";
import {
  DisableKeyCommandInput,
  DisableKeyCommandOutput,
} from "./commands/DisableKeyCommand";
import {
  DisableKeyRotationCommandInput,
  DisableKeyRotationCommandOutput,
} from "./commands/DisableKeyRotationCommand";
import {
  DisconnectCustomKeyStoreCommandInput,
  DisconnectCustomKeyStoreCommandOutput,
} from "./commands/DisconnectCustomKeyStoreCommand";
import {
  EnableKeyCommandInput,
  EnableKeyCommandOutput,
} from "./commands/EnableKeyCommand";
import {
  EnableKeyRotationCommandInput,
  EnableKeyRotationCommandOutput,
} from "./commands/EnableKeyRotationCommand";
import {
  EncryptCommandInput,
  EncryptCommandOutput,
} from "./commands/EncryptCommand";
import {
  GenerateDataKeyCommandInput,
  GenerateDataKeyCommandOutput,
} from "./commands/GenerateDataKeyCommand";
import {
  GenerateDataKeyPairCommandInput,
  GenerateDataKeyPairCommandOutput,
} from "./commands/GenerateDataKeyPairCommand";
import {
  GenerateDataKeyPairWithoutPlaintextCommandInput,
  GenerateDataKeyPairWithoutPlaintextCommandOutput,
} from "./commands/GenerateDataKeyPairWithoutPlaintextCommand";
import {
  GenerateDataKeyWithoutPlaintextCommandInput,
  GenerateDataKeyWithoutPlaintextCommandOutput,
} from "./commands/GenerateDataKeyWithoutPlaintextCommand";
import {
  GenerateMacCommandInput,
  GenerateMacCommandOutput,
} from "./commands/GenerateMacCommand";
import {
  GenerateRandomCommandInput,
  GenerateRandomCommandOutput,
} from "./commands/GenerateRandomCommand";
import {
  GetKeyPolicyCommandInput,
  GetKeyPolicyCommandOutput,
} from "./commands/GetKeyPolicyCommand";
import {
  GetKeyRotationStatusCommandInput,
  GetKeyRotationStatusCommandOutput,
} from "./commands/GetKeyRotationStatusCommand";
import {
  GetParametersForImportCommandInput,
  GetParametersForImportCommandOutput,
} from "./commands/GetParametersForImportCommand";
import {
  GetPublicKeyCommandInput,
  GetPublicKeyCommandOutput,
} from "./commands/GetPublicKeyCommand";
import {
  ImportKeyMaterialCommandInput,
  ImportKeyMaterialCommandOutput,
} from "./commands/ImportKeyMaterialCommand";
import {
  ListAliasesCommandInput,
  ListAliasesCommandOutput,
} from "./commands/ListAliasesCommand";
import {
  ListGrantsCommandInput,
  ListGrantsCommandOutput,
} from "./commands/ListGrantsCommand";
import {
  ListKeyPoliciesCommandInput,
  ListKeyPoliciesCommandOutput,
} from "./commands/ListKeyPoliciesCommand";
import {
  ListKeyRotationsCommandInput,
  ListKeyRotationsCommandOutput,
} from "./commands/ListKeyRotationsCommand";
import {
  ListKeysCommandInput,
  ListKeysCommandOutput,
} from "./commands/ListKeysCommand";
import {
  ListResourceTagsCommandInput,
  ListResourceTagsCommandOutput,
} from "./commands/ListResourceTagsCommand";
import {
  ListRetirableGrantsCommandInput,
  ListRetirableGrantsCommandOutput,
} from "./commands/ListRetirableGrantsCommand";
import {
  PutKeyPolicyCommandInput,
  PutKeyPolicyCommandOutput,
} from "./commands/PutKeyPolicyCommand";
import {
  ReEncryptCommandInput,
  ReEncryptCommandOutput,
} from "./commands/ReEncryptCommand";
import {
  ReplicateKeyCommandInput,
  ReplicateKeyCommandOutput,
} from "./commands/ReplicateKeyCommand";
import {
  RetireGrantCommandInput,
  RetireGrantCommandOutput,
} from "./commands/RetireGrantCommand";
import {
  RevokeGrantCommandInput,
  RevokeGrantCommandOutput,
} from "./commands/RevokeGrantCommand";
import {
  RotateKeyOnDemandCommandInput,
  RotateKeyOnDemandCommandOutput,
} from "./commands/RotateKeyOnDemandCommand";
import {
  ScheduleKeyDeletionCommandInput,
  ScheduleKeyDeletionCommandOutput,
} from "./commands/ScheduleKeyDeletionCommand";
import { SignCommandInput, SignCommandOutput } from "./commands/SignCommand";
import {
  TagResourceCommandInput,
  TagResourceCommandOutput,
} from "./commands/TagResourceCommand";
import {
  UntagResourceCommandInput,
  UntagResourceCommandOutput,
} from "./commands/UntagResourceCommand";
import {
  UpdateAliasCommandInput,
  UpdateAliasCommandOutput,
} from "./commands/UpdateAliasCommand";
import {
  UpdateCustomKeyStoreCommandInput,
  UpdateCustomKeyStoreCommandOutput,
} from "./commands/UpdateCustomKeyStoreCommand";
import {
  UpdateKeyDescriptionCommandInput,
  UpdateKeyDescriptionCommandOutput,
} from "./commands/UpdateKeyDescriptionCommand";
import {
  UpdatePrimaryRegionCommandInput,
  UpdatePrimaryRegionCommandOutput,
} from "./commands/UpdatePrimaryRegionCommand";
import {
  VerifyCommandInput,
  VerifyCommandOutput,
} from "./commands/VerifyCommand";
import {
  VerifyMacCommandInput,
  VerifyMacCommandOutput,
} from "./commands/VerifyMacCommand";
import { KMSClient } from "./KMSClient";
export interface KMS {
  cancelKeyDeletion(
    args: CancelKeyDeletionCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<CancelKeyDeletionCommandOutput>;
  cancelKeyDeletion(
    args: CancelKeyDeletionCommandInput,
    cb: (err: any, data?: CancelKeyDeletionCommandOutput) => void
  ): void;
  cancelKeyDeletion(
    args: CancelKeyDeletionCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: CancelKeyDeletionCommandOutput) => void
  ): void;
  connectCustomKeyStore(
    args: ConnectCustomKeyStoreCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ConnectCustomKeyStoreCommandOutput>;
  connectCustomKeyStore(
    args: ConnectCustomKeyStoreCommandInput,
    cb: (err: any, data?: ConnectCustomKeyStoreCommandOutput) => void
  ): void;
  connectCustomKeyStore(
    args: ConnectCustomKeyStoreCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ConnectCustomKeyStoreCommandOutput) => void
  ): void;
  createAlias(
    args: CreateAliasCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<CreateAliasCommandOutput>;
  createAlias(
    args: CreateAliasCommandInput,
    cb: (err: any, data?: CreateAliasCommandOutput) => void
  ): void;
  createAlias(
    args: CreateAliasCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: CreateAliasCommandOutput) => void
  ): void;
  createCustomKeyStore(
    args: CreateCustomKeyStoreCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<CreateCustomKeyStoreCommandOutput>;
  createCustomKeyStore(
    args: CreateCustomKeyStoreCommandInput,
    cb: (err: any, data?: CreateCustomKeyStoreCommandOutput) => void
  ): void;
  createCustomKeyStore(
    args: CreateCustomKeyStoreCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: CreateCustomKeyStoreCommandOutput) => void
  ): void;
  createGrant(
    args: CreateGrantCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<CreateGrantCommandOutput>;
  createGrant(
    args: CreateGrantCommandInput,
    cb: (err: any, data?: CreateGrantCommandOutput) => void
  ): void;
  createGrant(
    args: CreateGrantCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: CreateGrantCommandOutput) => void
  ): void;
  createKey(): Promise<CreateKeyCommandOutput>;
  createKey(
    args: CreateKeyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<CreateKeyCommandOutput>;
  createKey(
    args: CreateKeyCommandInput,
    cb: (err: any, data?: CreateKeyCommandOutput) => void
  ): void;
  createKey(
    args: CreateKeyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: CreateKeyCommandOutput) => void
  ): void;
  decrypt(
    args: DecryptCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DecryptCommandOutput>;
  decrypt(
    args: DecryptCommandInput,
    cb: (err: any, data?: DecryptCommandOutput) => void
  ): void;
  decrypt(
    args: DecryptCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DecryptCommandOutput) => void
  ): void;
  deleteAlias(
    args: DeleteAliasCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DeleteAliasCommandOutput>;
  deleteAlias(
    args: DeleteAliasCommandInput,
    cb: (err: any, data?: DeleteAliasCommandOutput) => void
  ): void;
  deleteAlias(
    args: DeleteAliasCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DeleteAliasCommandOutput) => void
  ): void;
  deleteCustomKeyStore(
    args: DeleteCustomKeyStoreCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DeleteCustomKeyStoreCommandOutput>;
  deleteCustomKeyStore(
    args: DeleteCustomKeyStoreCommandInput,
    cb: (err: any, data?: DeleteCustomKeyStoreCommandOutput) => void
  ): void;
  deleteCustomKeyStore(
    args: DeleteCustomKeyStoreCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DeleteCustomKeyStoreCommandOutput) => void
  ): void;
  deleteImportedKeyMaterial(
    args: DeleteImportedKeyMaterialCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DeleteImportedKeyMaterialCommandOutput>;
  deleteImportedKeyMaterial(
    args: DeleteImportedKeyMaterialCommandInput,
    cb: (err: any, data?: DeleteImportedKeyMaterialCommandOutput) => void
  ): void;
  deleteImportedKeyMaterial(
    args: DeleteImportedKeyMaterialCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DeleteImportedKeyMaterialCommandOutput) => void
  ): void;
  deriveSharedSecret(
    args: DeriveSharedSecretCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DeriveSharedSecretCommandOutput>;
  deriveSharedSecret(
    args: DeriveSharedSecretCommandInput,
    cb: (err: any, data?: DeriveSharedSecretCommandOutput) => void
  ): void;
  deriveSharedSecret(
    args: DeriveSharedSecretCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DeriveSharedSecretCommandOutput) => void
  ): void;
  describeCustomKeyStores(): Promise<DescribeCustomKeyStoresCommandOutput>;
  describeCustomKeyStores(
    args: DescribeCustomKeyStoresCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DescribeCustomKeyStoresCommandOutput>;
  describeCustomKeyStores(
    args: DescribeCustomKeyStoresCommandInput,
    cb: (err: any, data?: DescribeCustomKeyStoresCommandOutput) => void
  ): void;
  describeCustomKeyStores(
    args: DescribeCustomKeyStoresCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DescribeCustomKeyStoresCommandOutput) => void
  ): void;
  describeKey(
    args: DescribeKeyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DescribeKeyCommandOutput>;
  describeKey(
    args: DescribeKeyCommandInput,
    cb: (err: any, data?: DescribeKeyCommandOutput) => void
  ): void;
  describeKey(
    args: DescribeKeyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DescribeKeyCommandOutput) => void
  ): void;
  disableKey(
    args: DisableKeyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DisableKeyCommandOutput>;
  disableKey(
    args: DisableKeyCommandInput,
    cb: (err: any, data?: DisableKeyCommandOutput) => void
  ): void;
  disableKey(
    args: DisableKeyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DisableKeyCommandOutput) => void
  ): void;
  disableKeyRotation(
    args: DisableKeyRotationCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DisableKeyRotationCommandOutput>;
  disableKeyRotation(
    args: DisableKeyRotationCommandInput,
    cb: (err: any, data?: DisableKeyRotationCommandOutput) => void
  ): void;
  disableKeyRotation(
    args: DisableKeyRotationCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DisableKeyRotationCommandOutput) => void
  ): void;
  disconnectCustomKeyStore(
    args: DisconnectCustomKeyStoreCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<DisconnectCustomKeyStoreCommandOutput>;
  disconnectCustomKeyStore(
    args: DisconnectCustomKeyStoreCommandInput,
    cb: (err: any, data?: DisconnectCustomKeyStoreCommandOutput) => void
  ): void;
  disconnectCustomKeyStore(
    args: DisconnectCustomKeyStoreCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: DisconnectCustomKeyStoreCommandOutput) => void
  ): void;
  enableKey(
    args: EnableKeyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<EnableKeyCommandOutput>;
  enableKey(
    args: EnableKeyCommandInput,
    cb: (err: any, data?: EnableKeyCommandOutput) => void
  ): void;
  enableKey(
    args: EnableKeyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: EnableKeyCommandOutput) => void
  ): void;
  enableKeyRotation(
    args: EnableKeyRotationCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<EnableKeyRotationCommandOutput>;
  enableKeyRotation(
    args: EnableKeyRotationCommandInput,
    cb: (err: any, data?: EnableKeyRotationCommandOutput) => void
  ): void;
  enableKeyRotation(
    args: EnableKeyRotationCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: EnableKeyRotationCommandOutput) => void
  ): void;
  encrypt(
    args: EncryptCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<EncryptCommandOutput>;
  encrypt(
    args: EncryptCommandInput,
    cb: (err: any, data?: EncryptCommandOutput) => void
  ): void;
  encrypt(
    args: EncryptCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: EncryptCommandOutput) => void
  ): void;
  generateDataKey(
    args: GenerateDataKeyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GenerateDataKeyCommandOutput>;
  generateDataKey(
    args: GenerateDataKeyCommandInput,
    cb: (err: any, data?: GenerateDataKeyCommandOutput) => void
  ): void;
  generateDataKey(
    args: GenerateDataKeyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GenerateDataKeyCommandOutput) => void
  ): void;
  generateDataKeyPair(
    args: GenerateDataKeyPairCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GenerateDataKeyPairCommandOutput>;
  generateDataKeyPair(
    args: GenerateDataKeyPairCommandInput,
    cb: (err: any, data?: GenerateDataKeyPairCommandOutput) => void
  ): void;
  generateDataKeyPair(
    args: GenerateDataKeyPairCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GenerateDataKeyPairCommandOutput) => void
  ): void;
  generateDataKeyPairWithoutPlaintext(
    args: GenerateDataKeyPairWithoutPlaintextCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GenerateDataKeyPairWithoutPlaintextCommandOutput>;
  generateDataKeyPairWithoutPlaintext(
    args: GenerateDataKeyPairWithoutPlaintextCommandInput,
    cb: (
      err: any,
      data?: GenerateDataKeyPairWithoutPlaintextCommandOutput
    ) => void
  ): void;
  generateDataKeyPairWithoutPlaintext(
    args: GenerateDataKeyPairWithoutPlaintextCommandInput,
    options: __HttpHandlerOptions,
    cb: (
      err: any,
      data?: GenerateDataKeyPairWithoutPlaintextCommandOutput
    ) => void
  ): void;
  generateDataKeyWithoutPlaintext(
    args: GenerateDataKeyWithoutPlaintextCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GenerateDataKeyWithoutPlaintextCommandOutput>;
  generateDataKeyWithoutPlaintext(
    args: GenerateDataKeyWithoutPlaintextCommandInput,
    cb: (err: any, data?: GenerateDataKeyWithoutPlaintextCommandOutput) => void
  ): void;
  generateDataKeyWithoutPlaintext(
    args: GenerateDataKeyWithoutPlaintextCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GenerateDataKeyWithoutPlaintextCommandOutput) => void
  ): void;
  generateMac(
    args: GenerateMacCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GenerateMacCommandOutput>;
  generateMac(
    args: GenerateMacCommandInput,
    cb: (err: any, data?: GenerateMacCommandOutput) => void
  ): void;
  generateMac(
    args: GenerateMacCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GenerateMacCommandOutput) => void
  ): void;
  generateRandom(): Promise<GenerateRandomCommandOutput>;
  generateRandom(
    args: GenerateRandomCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GenerateRandomCommandOutput>;
  generateRandom(
    args: GenerateRandomCommandInput,
    cb: (err: any, data?: GenerateRandomCommandOutput) => void
  ): void;
  generateRandom(
    args: GenerateRandomCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GenerateRandomCommandOutput) => void
  ): void;
  getKeyPolicy(
    args: GetKeyPolicyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GetKeyPolicyCommandOutput>;
  getKeyPolicy(
    args: GetKeyPolicyCommandInput,
    cb: (err: any, data?: GetKeyPolicyCommandOutput) => void
  ): void;
  getKeyPolicy(
    args: GetKeyPolicyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GetKeyPolicyCommandOutput) => void
  ): void;
  getKeyRotationStatus(
    args: GetKeyRotationStatusCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GetKeyRotationStatusCommandOutput>;
  getKeyRotationStatus(
    args: GetKeyRotationStatusCommandInput,
    cb: (err: any, data?: GetKeyRotationStatusCommandOutput) => void
  ): void;
  getKeyRotationStatus(
    args: GetKeyRotationStatusCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GetKeyRotationStatusCommandOutput) => void
  ): void;
  getParametersForImport(
    args: GetParametersForImportCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GetParametersForImportCommandOutput>;
  getParametersForImport(
    args: GetParametersForImportCommandInput,
    cb: (err: any, data?: GetParametersForImportCommandOutput) => void
  ): void;
  getParametersForImport(
    args: GetParametersForImportCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GetParametersForImportCommandOutput) => void
  ): void;
  getPublicKey(
    args: GetPublicKeyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<GetPublicKeyCommandOutput>;
  getPublicKey(
    args: GetPublicKeyCommandInput,
    cb: (err: any, data?: GetPublicKeyCommandOutput) => void
  ): void;
  getPublicKey(
    args: GetPublicKeyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GetPublicKeyCommandOutput) => void
  ): void;
  importKeyMaterial(
    args: ImportKeyMaterialCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ImportKeyMaterialCommandOutput>;
  importKeyMaterial(
    args: ImportKeyMaterialCommandInput,
    cb: (err: any, data?: ImportKeyMaterialCommandOutput) => void
  ): void;
  importKeyMaterial(
    args: ImportKeyMaterialCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ImportKeyMaterialCommandOutput) => void
  ): void;
  listAliases(): Promise<ListAliasesCommandOutput>;
  listAliases(
    args: ListAliasesCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ListAliasesCommandOutput>;
  listAliases(
    args: ListAliasesCommandInput,
    cb: (err: any, data?: ListAliasesCommandOutput) => void
  ): void;
  listAliases(
    args: ListAliasesCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListAliasesCommandOutput) => void
  ): void;
  listGrants(
    args: ListGrantsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ListGrantsCommandOutput>;
  listGrants(
    args: ListGrantsCommandInput,
    cb: (err: any, data?: ListGrantsCommandOutput) => void
  ): void;
  listGrants(
    args: ListGrantsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListGrantsCommandOutput) => void
  ): void;
  listKeyPolicies(
    args: ListKeyPoliciesCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ListKeyPoliciesCommandOutput>;
  listKeyPolicies(
    args: ListKeyPoliciesCommandInput,
    cb: (err: any, data?: ListKeyPoliciesCommandOutput) => void
  ): void;
  listKeyPolicies(
    args: ListKeyPoliciesCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListKeyPoliciesCommandOutput) => void
  ): void;
  listKeyRotations(
    args: ListKeyRotationsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ListKeyRotationsCommandOutput>;
  listKeyRotations(
    args: ListKeyRotationsCommandInput,
    cb: (err: any, data?: ListKeyRotationsCommandOutput) => void
  ): void;
  listKeyRotations(
    args: ListKeyRotationsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListKeyRotationsCommandOutput) => void
  ): void;
  listKeys(): Promise<ListKeysCommandOutput>;
  listKeys(
    args: ListKeysCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ListKeysCommandOutput>;
  listKeys(
    args: ListKeysCommandInput,
    cb: (err: any, data?: ListKeysCommandOutput) => void
  ): void;
  listKeys(
    args: ListKeysCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListKeysCommandOutput) => void
  ): void;
  listResourceTags(
    args: ListResourceTagsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ListResourceTagsCommandOutput>;
  listResourceTags(
    args: ListResourceTagsCommandInput,
    cb: (err: any, data?: ListResourceTagsCommandOutput) => void
  ): void;
  listResourceTags(
    args: ListResourceTagsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListResourceTagsCommandOutput) => void
  ): void;
  listRetirableGrants(
    args: ListRetirableGrantsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ListRetirableGrantsCommandOutput>;
  listRetirableGrants(
    args: ListRetirableGrantsCommandInput,
    cb: (err: any, data?: ListRetirableGrantsCommandOutput) => void
  ): void;
  listRetirableGrants(
    args: ListRetirableGrantsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListRetirableGrantsCommandOutput) => void
  ): void;
  putKeyPolicy(
    args: PutKeyPolicyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<PutKeyPolicyCommandOutput>;
  putKeyPolicy(
    args: PutKeyPolicyCommandInput,
    cb: (err: any, data?: PutKeyPolicyCommandOutput) => void
  ): void;
  putKeyPolicy(
    args: PutKeyPolicyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: PutKeyPolicyCommandOutput) => void
  ): void;
  reEncrypt(
    args: ReEncryptCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ReEncryptCommandOutput>;
  reEncrypt(
    args: ReEncryptCommandInput,
    cb: (err: any, data?: ReEncryptCommandOutput) => void
  ): void;
  reEncrypt(
    args: ReEncryptCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ReEncryptCommandOutput) => void
  ): void;
  replicateKey(
    args: ReplicateKeyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ReplicateKeyCommandOutput>;
  replicateKey(
    args: ReplicateKeyCommandInput,
    cb: (err: any, data?: ReplicateKeyCommandOutput) => void
  ): void;
  replicateKey(
    args: ReplicateKeyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ReplicateKeyCommandOutput) => void
  ): void;
  retireGrant(): Promise<RetireGrantCommandOutput>;
  retireGrant(
    args: RetireGrantCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<RetireGrantCommandOutput>;
  retireGrant(
    args: RetireGrantCommandInput,
    cb: (err: any, data?: RetireGrantCommandOutput) => void
  ): void;
  retireGrant(
    args: RetireGrantCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: RetireGrantCommandOutput) => void
  ): void;
  revokeGrant(
    args: RevokeGrantCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<RevokeGrantCommandOutput>;
  revokeGrant(
    args: RevokeGrantCommandInput,
    cb: (err: any, data?: RevokeGrantCommandOutput) => void
  ): void;
  revokeGrant(
    args: RevokeGrantCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: RevokeGrantCommandOutput) => void
  ): void;
  rotateKeyOnDemand(
    args: RotateKeyOnDemandCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<RotateKeyOnDemandCommandOutput>;
  rotateKeyOnDemand(
    args: RotateKeyOnDemandCommandInput,
    cb: (err: any, data?: RotateKeyOnDemandCommandOutput) => void
  ): void;
  rotateKeyOnDemand(
    args: RotateKeyOnDemandCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: RotateKeyOnDemandCommandOutput) => void
  ): void;
  scheduleKeyDeletion(
    args: ScheduleKeyDeletionCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<ScheduleKeyDeletionCommandOutput>;
  scheduleKeyDeletion(
    args: ScheduleKeyDeletionCommandInput,
    cb: (err: any, data?: ScheduleKeyDeletionCommandOutput) => void
  ): void;
  scheduleKeyDeletion(
    args: ScheduleKeyDeletionCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ScheduleKeyDeletionCommandOutput) => void
  ): void;
  sign(
    args: SignCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<SignCommandOutput>;
  sign(
    args: SignCommandInput,
    cb: (err: any, data?: SignCommandOutput) => void
  ): void;
  sign(
    args: SignCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: SignCommandOutput) => void
  ): void;
  tagResource(
    args: TagResourceCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<TagResourceCommandOutput>;
  tagResource(
    args: TagResourceCommandInput,
    cb: (err: any, data?: TagResourceCommandOutput) => void
  ): void;
  tagResource(
    args: TagResourceCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: TagResourceCommandOutput) => void
  ): void;
  untagResource(
    args: UntagResourceCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<UntagResourceCommandOutput>;
  untagResource(
    args: UntagResourceCommandInput,
    cb: (err: any, data?: UntagResourceCommandOutput) => void
  ): void;
  untagResource(
    args: UntagResourceCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: UntagResourceCommandOutput) => void
  ): void;
  updateAlias(
    args: UpdateAliasCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<UpdateAliasCommandOutput>;
  updateAlias(
    args: UpdateAliasCommandInput,
    cb: (err: any, data?: UpdateAliasCommandOutput) => void
  ): void;
  updateAlias(
    args: UpdateAliasCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: UpdateAliasCommandOutput) => void
  ): void;
  updateCustomKeyStore(
    args: UpdateCustomKeyStoreCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<UpdateCustomKeyStoreCommandOutput>;
  updateCustomKeyStore(
    args: UpdateCustomKeyStoreCommandInput,
    cb: (err: any, data?: UpdateCustomKeyStoreCommandOutput) => void
  ): void;
  updateCustomKeyStore(
    args: UpdateCustomKeyStoreCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: UpdateCustomKeyStoreCommandOutput) => void
  ): void;
  updateKeyDescription(
    args: UpdateKeyDescriptionCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<UpdateKeyDescriptionCommandOutput>;
  updateKeyDescription(
    args: UpdateKeyDescriptionCommandInput,
    cb: (err: any, data?: UpdateKeyDescriptionCommandOutput) => void
  ): void;
  updateKeyDescription(
    args: UpdateKeyDescriptionCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: UpdateKeyDescriptionCommandOutput) => void
  ): void;
  updatePrimaryRegion(
    args: UpdatePrimaryRegionCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<UpdatePrimaryRegionCommandOutput>;
  updatePrimaryRegion(
    args: UpdatePrimaryRegionCommandInput,
    cb: (err: any, data?: UpdatePrimaryRegionCommandOutput) => void
  ): void;
  updatePrimaryRegion(
    args: UpdatePrimaryRegionCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: UpdatePrimaryRegionCommandOutput) => void
  ): void;
  verify(
    args: VerifyCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<VerifyCommandOutput>;
  verify(
    args: VerifyCommandInput,
    cb: (err: any, data?: VerifyCommandOutput) => void
  ): void;
  verify(
    args: VerifyCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: VerifyCommandOutput) => void
  ): void;
  verifyMac(
    args: VerifyMacCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<VerifyMacCommandOutput>;
  verifyMac(
    args: VerifyMacCommandInput,
    cb: (err: any, data?: VerifyMacCommandOutput) => void
  ): void;
  verifyMac(
    args: VerifyMacCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: VerifyMacCommandOutput) => void
  ): void;
}
export declare class KMS extends KMSClient implements KMS {}
