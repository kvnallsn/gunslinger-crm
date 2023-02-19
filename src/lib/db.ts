import { Pool, PoolClient } from 'pg';
import { createClient, RedisClientType } from 'redis';

type SqlClient = PoolClient;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
})

async function getDatabaseConn(): Promise<PoolClient> {
    return await pool.connect();
}

async function runDatabaseTx<T>(fn: (db: SqlClient) => Promise<T>) {
    const db = await getDatabaseConn();
    await db.query('BEGIN');
    try {
        const val: T = await fn(db);
        await db.query('COMMIT');
        db.release();
        return val;
    } catch (error: any) {
        await db.query('ROLLBACK');
        db.release();
        throw error;
    }
}

async function createSessionClient() {
    const sessionClient = createClient({
        url: process.env.REDIS_URL
    });

    await sessionClient.connect();

    return sessionClient;
}


export { pool, getDatabaseConn, runDatabaseTx, createSessionClient };
export type { SqlClient };