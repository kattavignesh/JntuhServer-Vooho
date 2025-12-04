const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

async function createTables() {
    const client = await pool.connect();
    try {
        console.log('🔌 Connected to Neon Postgres...');

        // 1. Create Students Table
        console.log('Creating students table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        hall_ticket VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255),
        college_code VARCHAR(10),
        regulation VARCHAR(10),
        year VARCHAR(10),
        semester VARCHAR(10),
        status VARCHAR(20),
        sgpa DECIMAL(4, 2),
        cgpa DECIMAL(4, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2. Create Subjects Table
        console.log('Creating subjects table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        subject_code VARCHAR(50) PRIMARY KEY,
        subject_name VARCHAR(255) NOT NULL,
        credits DECIMAL(3, 1)
      );
    `);

        // 3. Create Marks Table
        console.log('Creating marks table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id SERIAL PRIMARY KEY,
        hall_ticket VARCHAR(20) REFERENCES students(hall_ticket),
        subject_code VARCHAR(50),
        internal VARCHAR(10),
        external VARCHAR(10),
        total VARCHAR(10),
        grade VARCHAR(5),
        grade_points DECIMAL(3, 1),
        credits DECIMAL(3, 1),
        UNIQUE(hall_ticket, subject_code)
      );
    `);

        // 4. Create Indexes for Performance
        console.log('Creating indexes...');
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_students_college ON students(college_code);
      CREATE INDEX IF NOT EXISTS idx_marks_hall_ticket ON marks(hall_ticket);
    `);

        console.log('✅ All tables created successfully!');
    } catch (err) {
        console.error('❌ Error creating tables:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

createTables();
