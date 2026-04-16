const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Always use this for Neon to avoid environment-based connection failures
  ssl: {
    rejectUnauthorized: false, 
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
});

pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed', { 
        text: text.substring(0, 50), 
        duration: `${duration}ms`, 
        rows: res.rowCount 
      });
    }
    return res;
  } catch (error) {
    console.error('❌ Query execution error:', error);
    throw error; // Re-throw so the calling function knows it failed
  }
};

module.exports = { pool, query };