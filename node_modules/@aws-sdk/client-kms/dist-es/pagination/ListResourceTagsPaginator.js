import { createPaginator } from "@smithy/core";
import { ListResourceTagsCommand, } from "../commands/ListResourceTagsCommand";
import { KMSClient } from "../KMSClient";
export const paginateListResourceTags = createPaginator(KMSClient, ListResourceTagsCommand, "Marker", "NextMarker", "Limit");
