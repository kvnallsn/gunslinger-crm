import { Pool, PoolClient } from 'pg';
import { createClient, RedisClientType } from 'redis';

type SqlClient = PoolClient;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
})

async function dbConnect(): Promise<PoolClient> {
    return await pool.connect();
}

async function beginTransation(db: PoolClient) {
    await db.query("BEGIN");
}

async function rollbackTransaction(db: PoolClient | undefined) {
    if (db !== undefined) {
        await db.query("ROLLBACK");
    }
}

async function commitTranscation(db: PoolClient) {
    await db.query("COMMIT");
}

async function createSessionClient() {
    const sessionClient = createClient({
        url: process.env.REDIS_URL
    });

    await sessionClient.connect();

    return sessionClient;
}


export { pool, dbConnect, beginTransation, rollbackTransaction, commitTranscation, createSessionClient };
export type { SqlClient };