import type { AwsCredentialIdentityProvider } from '@smithy/types';
import type { FromWebTokenInit } from '@aws-sdk/credential-provider-web-identity';
/**
 * The init object for the `awsCredentialsProvider` function.
 *
 * @typedef {Object} AwsCredentialsProviderInit
 * @property {string} roleArn - ARN of the role that the caller is assuming.
 * @property {Object} [clientConfig] - Custom STS client configurations overriding the default ones.
 * @property {Array} [clientPlugins] - Custom STS client middleware plugin to modify the client default behavior.
 * @property {Function} [roleAssumerWithWebIdentity] - A function that assumes a role with web identity and returns a promise fulfilled with credentials for the assumed role.
 * @property {string} [roleSessionName] - An identifier for the assumed role session.
 * @property {string} [providerId] - The fully qualified host component of the domain name of the identity provider.
 * @property {Array} [policyArns] - ARNs of the IAM managed policies that you want to use as managed session policies.
 * @property {string} [policy] - An IAM policy in JSON format that you want to use as an inline session policy.
 * @property {number} [durationSeconds=3600] - The duration, in seconds, of the role session. Defaults to 3600 seconds.
 */
export interface AwsCredentialsProviderInit// eslint-disable-line @typescript-eslint/no-empty-interface
 extends Omit<FromWebTokenInit, 'webIdentityToken'> {
}
export declare function awsCredentialsProvider(init: AwsCredentialsProviderInit): AwsCredentialIdentityProvider;
