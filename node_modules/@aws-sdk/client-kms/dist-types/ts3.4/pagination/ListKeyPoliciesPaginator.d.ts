import { Paginator } from "@smithy/types";
import {
  ListKeyPoliciesCommandInput,
  ListKeyPoliciesCommandOutput,
} from "../commands/ListKeyPoliciesCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
export declare const paginateListKeyPolicies: (
  config: KMSPaginationConfiguration,
  input: ListKeyPoliciesCommandInput,
  ...rest: any[]
) => Paginator<ListKeyPoliciesCommandOutput>;
