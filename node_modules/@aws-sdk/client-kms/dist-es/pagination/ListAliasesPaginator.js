import { createPaginator } from "@smithy/core";
import { ListAliasesCommand } from "../commands/ListAliasesCommand";
import { KMSClient } from "../KMSClient";
export const paginateListAliases = createPaginator(KMSClient, ListAliasesCommand, "Marker", "NextMarker", "Limit");
