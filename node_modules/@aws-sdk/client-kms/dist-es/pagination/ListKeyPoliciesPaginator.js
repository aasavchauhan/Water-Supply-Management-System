import { createPaginator } from "@smithy/core";
import { ListKeyPoliciesCommand, } from "../commands/ListKeyPoliciesCommand";
import { KMSClient } from "../KMSClient";
export const paginateListKeyPolicies = createPaginator(KMSClient, ListKeyPoliciesCommand, "Marker", "NextMarker", "Limit");
