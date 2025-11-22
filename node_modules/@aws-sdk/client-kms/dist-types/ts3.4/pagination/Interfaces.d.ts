import { PaginationConfiguration } from "@smithy/types";
import { KMSClient } from "../KMSClient";
export interface KMSPaginationConfiguration extends PaginationConfiguration {
  client: KMSClient;
}
