const { query } = require('./index');
require('dotenv').config();

const migrate = async () => {
  console.log('🚀 Running migrations...');

  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        daily_goal INTEGER DEFAULT 3,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Problems table
    await query(`
      CREATE TABLE IF NOT EXISTS problems (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        topic VARCHAR(100) NOT NULL,
        difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
        link VARCHAR(500),
        platform VARCHAR(50) DEFAULT 'LeetCode',
        sheet_name VARCHAR(100) DEFAULT 'Top 180 DSA',
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // User problem status table
    await query(`
      CREATE TABLE IF NOT EXISTS user_problem_status (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
        status VARCHAR(20) CHECK (status IN ('SOLVED', 'PENDING', 'REVISION')) DEFAULT 'PENDING',
        notes TEXT,
        time_taken INTEGER,
        last_updated TIMESTAMP DEFAULT NOW(),
        solved_at TIMESTAMP,
        UNIQUE(user_id, problem_id)
      )
    `);

    // Daily activity table (for streaks and heatmap)
    await query(`
      CREATE TABLE IF NOT EXISTS daily_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE NOT NULL,
        problems_solved INTEGER DEFAULT 0,
        UNIQUE(user_id, activity_date)
      )
    `);

    // Indexes for performance
    await query(`CREATE INDEX IF NOT EXISTS idx_ups_user_id ON user_problem_status(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_ups_problem_id ON user_problem_status(problem_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_ups_status ON user_problem_status(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_problems_topic ON problems(topic)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_daily_activity_user ON daily_activity(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_daily_activity_date ON daily_activity(activity_date)`);

    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrate();
