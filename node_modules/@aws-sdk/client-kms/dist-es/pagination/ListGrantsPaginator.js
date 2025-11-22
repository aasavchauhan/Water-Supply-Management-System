import { createPaginator } from "@smithy/core";
import { ListGrantsCommand } from "../commands/ListGrantsCommand";
import { KMSClient } from "../KMSClient";
export const paginateListGrants = createPaginator(KMSClient, ListGrantsCommand, "Marker", "NextMarker", "Limit");
