interface PgPool {
    options?: {
        idleTimeoutMillis?: number | null;
    };
    on?: (event: 'release', listener: (...args: any[]) => void) => void;
}
interface MySQLPool {
    config?: {
        connectionConfig?: {
            idleTimeout?: number;
        };
    };
    on?: (event: 'release', listener: (...args: any[]) => void) => void;
}
interface MySQL2Pool {
    config?: {
        idleTimeout?: number;
    };
    on?: (event: 'release', listener: (...args: any[]) => void) => void;
}
interface MariaDBPool {
    config?: {
        idleTimeout?: number;
    };
    on?: (event: 'release', listener: (...args: any[]) => void) => void;
}
interface MongoDBPool {
    options?: {
        maxIdleTimeMS?: number;
    };
    on?: (event: 'connectionCheckedOut' | 'connectionCheckedIn' | 'connectionPoolCreated' | 'connectionPoolClosed' | 'connectionCreated' | 'connectionReady' | 'connectionClosed', listener: (...args: any[]) => void) => void;
}
interface RedisPool {
    options?: any;
    on?: (event: 'ready' | 'end' | 'error' | 'connect', listener: (...args: any[]) => void) => void;
    status?: string;
}
interface CassandraPool {
    connect?: (callback?: (err?: Error) => void) => Promise<void>;
    execute?: (query: string, params?: any[], options?: any) => Promise<any>;
}
/**
 * The database pool object. The supported pool types are:
 * - PostgreSQL (pg)
 * - MySQL2
 * - MariaDB
 * - MongoDB
 * - Redis (ioredis)
 * - Cassandra (cassandra-driver)
 * - OTHER: This method uses duck-typing to detect the pool type. Respectively you can
 *   pass in any object with a compatible interface.
 */
export type DbPool = PgPool | MySQLPool | MySQL2Pool | MariaDBPool | MongoDBPool | RedisPool | CassandraPool;
/**
 * Call this function right after creating a database pool with the database pool object
 * as argument.
 * This ensures that the current function instance stays alive long enough for
 * idle database connections to be removed from the pool.
 *
 * @param dbPool - The database pool object. The supported pool types are:
 * - PostgreSQL (pg)
 * - MySQL2
 * - MariaDB
 * - MongoDB
 * - Redis (ioredis)
 * - Cassandra (cassandra-driver)
 * - OTHER: This method uses duck-typing to detect the pool type. Respectively you can
 *   pass in any object with a compatible interface.
 *
 * @example
 * ```ts
 * const pgPool = new Pool({
 *   connectionString: process.env.DATABASE_URL,
 * });
 * attachDatabasePool(pgPool);
 * ```
 *
 * @experimental
 */
export declare function attachDatabasePool(dbPool: DbPool): void;
/**
 * @deprecated Use attachDatabasePool instead.
 */
export declare const experimental_attachDatabasePool: typeof attachDatabasePool;
export {};
