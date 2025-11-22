import { RuntimeCache } from './cache/types';
type Context = {
    waitUntil?: (promise: Promise<unknown>) => void;
    cache?: RuntimeCache;
    headers?: Record<string, string>;
};
export declare const SYMBOL_FOR_REQ_CONTEXT: unique symbol;
export declare function getContext(): Context;
export {};
