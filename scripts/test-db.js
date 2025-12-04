require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');

console.log('Testing connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
    const masked = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
    console.log('URL:', masked);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

pool.connect()
    .then(client => {
        console.log('✅ Successfully connected to Neon!');
        client.release();
        pool.end();
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        pool.end();
    });
