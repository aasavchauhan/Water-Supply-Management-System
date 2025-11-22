export declare class BuildCache {
    private readonly endpoint;
    private readonly headers;
    private readonly onError?;
    constructor({ endpoint, headers, onError, }: {
        endpoint: string;
        headers: Record<string, string>;
        onError?: (error: Error) => void;
    });
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown, options?: {
        name?: string;
        ttl?: number;
        tags?: string[];
    }) => Promise<void>;
    delete: (key: string) => Promise<void>;
    expireTag: (tag: string | string[]) => Promise<void>;
}
