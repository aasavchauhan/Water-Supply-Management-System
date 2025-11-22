import { createPaginator } from "@smithy/core";
import { ListRetirableGrantsCommand, } from "../commands/ListRetirableGrantsCommand";
import { KMSClient } from "../KMSClient";
export const paginateListRetirableGrants = createPaginator(KMSClient, ListRetirableGrantsCommand, "Marker", "NextMarker", "Limit");
