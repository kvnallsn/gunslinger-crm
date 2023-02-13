import { Pool, PoolClient } from 'pg';

type SqlClient = Pool | PoolClient;

export type { SqlClient };
