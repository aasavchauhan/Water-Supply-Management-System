import {
  AwsSdkSigV4AuthInputConfig,
  AwsSdkSigV4AuthResolvedConfig,
  AwsSdkSigV4PreviouslyResolved,
} from "@aws-sdk/core";
import {
  HandlerExecutionContext,
  HttpAuthScheme,
  HttpAuthSchemeParameters,
  HttpAuthSchemeParametersProvider,
  HttpAuthSchemeProvider,
  Provider,
} from "@smithy/types";
import { KMSClientResolvedConfig } from "../KMSClient";
export interface KMSHttpAuthSchemeParameters extends HttpAuthSchemeParameters {
  region?: string;
}
export interface KMSHttpAuthSchemeParametersProvider
  extends HttpAuthSchemeParametersProvider<
    KMSClientResolvedConfig,
    HandlerExecutionContext,
    KMSHttpAuthSchemeParameters,
    object
  > {}
export declare const defaultKMSHttpAuthSchemeParametersProvider: (
  config: KMSClientResolvedConfig,
  context: HandlerExecutionContext,
  input: object
) => Promise<KMSHttpAuthSchemeParameters>;
export interface KMSHttpAuthSchemeProvider
  extends HttpAuthSchemeProvider<KMSHttpAuthSchemeParameters> {}
export declare const defaultKMSHttpAuthSchemeProvider: KMSHttpAuthSchemeProvider;
export interface HttpAuthSchemeInputConfig extends AwsSdkSigV4AuthInputConfig {
  authSchemePreference?: string[] | Provider<string[]>;
  httpAuthSchemes?: HttpAuthScheme[];
  httpAuthSchemeProvider?: KMSHttpAuthSchemeProvider;
}
export interface HttpAuthSchemeResolvedConfig
  extends AwsSdkSigV4AuthResolvedConfig {
  readonly authSchemePreference: Provider<string[]>;
  readonly httpAuthSchemes: HttpAuthScheme[];
  readonly httpAuthSchemeProvider: KMSHttpAuthSchemeProvider;
}
export declare const resolveHttpAuthSchemeConfig: <T>(
  config: T & HttpAuthSchemeInputConfig & AwsSdkSigV4PreviouslyResolved
) => T & HttpAuthSchemeResolvedConfig;
