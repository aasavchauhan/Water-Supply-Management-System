import { Paginator } from "@smithy/types";
import { ListResourceTagsCommandInput, ListResourceTagsCommandOutput } from "../commands/ListResourceTagsCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListResourceTags: (config: KMSPaginationConfiguration, input: ListResourceTagsCommandInput, ...rest: any[]) => Paginator<ListResourceTagsCommandOutput>;
