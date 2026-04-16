const { query } = require('../db/index');

const getProblems = async (req, res) => {
  try {
    const { topic, difficulty, status, search, page = 1, limit = 50 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    let conditions = [];
    let params = [userId];
    let paramCount = 1;

    if (topic && topic !== 'All') {
      paramCount++;
      conditions.push(`p.topic = $${paramCount}`);
      params.push(topic);
    }

    if (difficulty && difficulty !== 'All') {
      paramCount++;
      conditions.push(`p.difficulty = $${paramCount}`);
      params.push(difficulty);
    }

    if (status && status !== 'All') {
      if (status === 'PENDING') {
        conditions.push(`(ups.status = 'PENDING' OR ups.status IS NULL)`);
      } else {
        paramCount++;
        conditions.push(`ups.status = $${paramCount}`);
        params.push(status);
      }
    }

    if (search) {
      paramCount++;
      conditions.push(`p.title ILIKE $${paramCount}`);
      params.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const problemsQuery = `
      SELECT 
        p.id,
        p.title,
        p.topic,
        p.difficulty,
        p.link,
        p.platform,
        p.sheet_name,
        p.order_index,
        COALESCE(ups.status, 'PENDING') as status,
        ups.notes,
        ups.last_updated,
        ups.solved_at
      FROM problems p
      LEFT JOIN user_problem_status ups ON p.id = ups.problem_id AND ups.user_id = $1
      ${whereClause}
      ORDER BY p.order_index ASC
      LIMIT ${parseInt(limit)} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM problems p
      LEFT JOIN user_problem_status ups ON p.id = ups.problem_id AND ups.user_id = $1
      ${whereClause}
    `;

    const [problemsResult, countResult] = await Promise.all([
      query(problemsQuery, params),
      query(countQuery, params),
    ]);

    res.json({
      problems: problemsResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error('Get problems error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTopics = async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT topic FROM problems ORDER BY topic');
    res.json({ topics: result.rows.map(r => r.topic) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProblemStatus = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    if (!['SOLVED', 'PENDING', 'REVISION'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const solvedAt = status === 'SOLVED' ? 'NOW()' : 'NULL';

    const result = await query(
      `INSERT INTO user_problem_status (user_id, problem_id, status, notes, last_updated, solved_at)
       VALUES ($1, $2, $3, $4, NOW(), ${solvedAt})
       ON CONFLICT (user_id, problem_id) 
       DO UPDATE SET status = $3, notes = $4, last_updated = NOW(), solved_at = ${status === 'SOLVED' ? 'COALESCE(user_problem_status.solved_at, NOW())' : 'NULL'}
       RETURNING *`,
      [userId, problemId, status, notes || null]
    );

    // Update daily activity if solved
    if (status === 'SOLVED') {
      await query(
        `INSERT INTO daily_activity (user_id, activity_date, problems_solved)
         VALUES ($1, CURRENT_DATE, 1)
         ON CONFLICT (user_id, activity_date)
         DO UPDATE SET problems_solved = daily_activity.problems_solved + 1`,
        [userId]
      );
    }

    res.json({ status: result.rows[0] });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getProblems, getTopics, updateProblemStatus };
