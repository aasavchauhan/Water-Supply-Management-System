import { Paginator } from "@smithy/types";
import {
  ListRetirableGrantsCommandInput,
  ListRetirableGrantsCommandOutput,
} from "../commands/ListRetirableGrantsCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
export declare const paginateListRetirableGrants: (
  config: KMSPaginationConfiguration,
  input: ListRetirableGrantsCommandInput,
  ...rest: any[]
) => Paginator<ListRetirableGrantsCommandOutput>;
