import { createPaginator } from "@smithy/core";
import { ListKeysCommand } from "../commands/ListKeysCommand";
import { KMSClient } from "../KMSClient";
export const paginateListKeys = createPaginator(KMSClient, ListKeysCommand, "Marker", "NextMarker", "Limit");
