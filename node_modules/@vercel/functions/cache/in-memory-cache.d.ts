import { RuntimeCache } from './types';
export declare class InMemoryCache implements RuntimeCache {
    private cache;
    get(key: string): Promise<unknown | null>;
    set(key: string, value: unknown, options?: {
        ttl?: number;
        tags?: string[];
    }): Promise<void>;
    delete(key: string): Promise<void>;
    expireTag(tag: string | string[]): Promise<void>;
}
