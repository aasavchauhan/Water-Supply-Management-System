declare class BaseWebAuthnAbortService {
    private controller;
    createNewAbortSignal(): AbortSignal;
    cancelCeremony(): void;
}
export declare const WebAuthnAbortService: BaseWebAuthnAbortService;
export {};
