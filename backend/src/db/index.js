const { Pool } = require('pg');
require('dotenv').config();

const isServerless = !!process.env.VERCEL;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon (and most hosted Postgres) require SSL
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  // Keep the pool small: Neon free tier has limited connections and
  // serverless functions each get their own pool.
  max: parseInt(process.env.DB_POOL_MAX, 10) || (isServerless ? 1 : 5),
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  // Neon closes idle connections when it scales to zero; don't crash the process
  console.error('❌ Database pool error:', err.message);
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed', {
        text: text.substring(0, 50),
        duration: `${Date.now() - start}ms`,
        rows: res.rowCount,
      });
    }
    return res;
  } catch (error) {
    console.error('❌ Query execution error:', error.message);
    throw error;
  }
};

module.exports = { pool, query };
