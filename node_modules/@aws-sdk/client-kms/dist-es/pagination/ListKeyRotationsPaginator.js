import { createPaginator } from "@smithy/core";
import { ListKeyRotationsCommand, } from "../commands/ListKeyRotationsCommand";
import { KMSClient } from "../KMSClient";
export const paginateListKeyRotations = createPaginator(KMSClient, ListKeyRotationsCommand, "Marker", "NextMarker", "Limit");
