import { Paginator } from "@smithy/types";
import { ListAliasesCommandInput, ListAliasesCommandOutput } from "../commands/ListAliasesCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListAliases: (config: KMSPaginationConfiguration, input: ListAliasesCommandInput, ...rest: any[]) => Paginator<ListAliasesCommandOutput>;
