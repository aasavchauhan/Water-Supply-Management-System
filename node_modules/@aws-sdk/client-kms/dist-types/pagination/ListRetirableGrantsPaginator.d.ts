import { Paginator } from "@smithy/types";
import { ListRetirableGrantsCommandInput, ListRetirableGrantsCommandOutput } from "../commands/ListRetirableGrantsCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListRetirableGrants: (config: KMSPaginationConfiguration, input: ListRetirableGrantsCommandInput, ...rest: any[]) => Paginator<ListRetirableGrantsCommandOutput>;
