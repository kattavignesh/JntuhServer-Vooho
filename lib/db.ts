import { Pool } from '@neondatabase/serverless';
import { env } from '@/src/config/env';

// Create a connection pool to Neon Postgres
const pool = new Pool({
    connectionString: env.database.url,
    ssl: true,
    max: 20, // Max connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export default pool;
