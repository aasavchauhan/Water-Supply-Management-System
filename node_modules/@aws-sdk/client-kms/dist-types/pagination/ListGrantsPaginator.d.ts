import { Paginator } from "@smithy/types";
import { ListGrantsCommandInput, ListGrantsCommandOutput } from "../commands/ListGrantsCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListGrants: (config: KMSPaginationConfiguration, input: ListGrantsCommandInput, ...rest: any[]) => Paginator<ListGrantsCommandOutput>;
