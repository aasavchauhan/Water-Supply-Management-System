import { Paginator } from "@smithy/types";
import {
  ListKeysCommandInput,
  ListKeysCommandOutput,
} from "../commands/ListKeysCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
export declare const paginateListKeys: (
  config: KMSPaginationConfiguration,
  input: ListKeysCommandInput,
  ...rest: any[]
) => Paginator<ListKeysCommandOutput>;
