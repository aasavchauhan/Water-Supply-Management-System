import { Paginator } from "@smithy/types";
import { ListKeyRotationsCommandInput, ListKeyRotationsCommandOutput } from "../commands/ListKeyRotationsCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListKeyRotations: (config: KMSPaginationConfiguration, input: ListKeyRotationsCommandInput, ...rest: any[]) => Paginator<ListKeyRotationsCommandOutput>;
