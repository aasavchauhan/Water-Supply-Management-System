import { Paginator } from "@smithy/types";
import { DescribeCustomKeyStoresCommandInput, DescribeCustomKeyStoresCommandOutput } from "../commands/DescribeCustomKeyStoresCommand";
import { KMSPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateDescribeCustomKeyStores: (config: KMSPaginationConfiguration, input: DescribeCustomKeyStoresCommandInput, ...rest: any[]) => Paginator<DescribeCustomKeyStoresCommandOutput>;
