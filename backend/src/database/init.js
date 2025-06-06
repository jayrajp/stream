require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'streaming',
  password: process.env.PGPASSWORD || '123@Jayraj',
  port: process.env.PGPORT || 5433,
});

async function getDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('🔄 Starting DB initialization transaction...');

    // pgcrypto extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    console.log('✅ pgcrypto extension ensured');

    const tables = [
      {
        name: 'users',
        query: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
      },
      {
        name: 'channels',
        query: `
          CREATE TABLE IF NOT EXISTS channels (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            owner_id UUID NOT NULL REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
      },
      {
        name: 'streams',
        query: `
          CREATE TABLE IF NOT EXISTS streams (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            channel_id UUID NOT NULL REFERENCES channels(id),
            status TEXT NOT NULL,
            started_at TIMESTAMP,
            ended_at TIMESTAMP,
            recording_path TEXT,
            transcript_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
      },
      {
        name: 'viewers',
        query: `
          CREATE TABLE IF NOT EXISTS viewers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            left_at TIMESTAMP
          )`,
      },
      {
        name: 'chat_messages',
        query: `
          CREATE TABLE IF NOT EXISTS chat_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
            viewer_id UUID REFERENCES viewers(id),
            message TEXT NOT NULL,
            sentiment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
      },
      {
        name: 'mood_logs',
        query: `
          CREATE TABLE IF NOT EXISTS mood_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
            mood TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
      },
      {
        name: 'keywords',
        query: `
          CREATE TABLE IF NOT EXISTS keywords (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
            keyword TEXT NOT NULL,
            frequency INTEGER NOT NULL
          )`,
      }
    ];

    for (const { name, query } of tables) {
      try {
        await client.query(query);
        console.log(`✅ Table ensured: ${name}`);
      } catch (err) {
        console.error(`❌ Error creating table "${name}": ${err.message}`);
        throw err; // Force rollback on any failure
      }
    }

    await client.query('COMMIT');
    console.log('🎉 PostgreSQL database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('🔥 Rolling back DB init due to error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  getDatabase
};
