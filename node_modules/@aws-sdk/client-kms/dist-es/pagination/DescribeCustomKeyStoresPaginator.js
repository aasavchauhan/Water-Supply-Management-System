import { createPaginator } from "@smithy/core";
import { DescribeCustomKeyStoresCommand, } from "../commands/DescribeCustomKeyStoresCommand";
import { KMSClient } from "../KMSClient";
export const paginateDescribeCustomKeyStores = createPaginator(KMSClient, DescribeCustomKeyStoresCommand, "Marker", "NextMarker", "Limit");
