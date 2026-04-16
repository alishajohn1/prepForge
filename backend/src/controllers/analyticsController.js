const { query } = require('../db/index');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Overall progress
    const overallQuery = await query(`
      SELECT 
        COUNT(p.id) as total,
        COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) as solved,
        COUNT(CASE WHEN ups.status = 'REVISION' THEN 1 END) as revision,
        COUNT(CASE WHEN ups.status = 'PENDING' OR ups.status IS NULL THEN 1 END) as pending
      FROM problems p
      LEFT JOIN user_problem_status ups ON p.id = ups.problem_id AND ups.user_id = $1
    `, [userId]);

    // Topic-wise progress
    const topicQuery = await query(`
      SELECT 
        p.topic,
        COUNT(p.id) as total,
        COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) as solved,
        COUNT(CASE WHEN ups.status = 'REVISION' THEN 1 END) as revision,
        ROUND(COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) * 100.0 / COUNT(p.id), 1) as percentage
      FROM problems p
      LEFT JOIN user_problem_status ups ON p.id = ups.problem_id AND ups.user_id = $1
      GROUP BY p.topic
      ORDER BY percentage DESC
    `, [userId]);

    // Difficulty-wise progress
    const difficultyQuery = await query(`
      SELECT 
        p.difficulty,
        COUNT(p.id) as total,
        COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) as solved,
        ROUND(COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) * 100.0 / COUNT(p.id), 1) as percentage
      FROM problems p
      LEFT JOIN user_problem_status ups ON p.id = ups.problem_id AND ups.user_id = $1
      GROUP BY p.difficulty
      ORDER BY CASE p.difficulty WHEN 'Easy' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Hard' THEN 3 END
    `, [userId]);

    // Streak calculation
    const streakQuery = await query(`
      WITH dates AS (
        SELECT activity_date, problems_solved
        FROM daily_activity
        WHERE user_id = $1 AND problems_solved > 0
        ORDER BY activity_date DESC
      ),
      consecutive AS (
        SELECT 
          activity_date,
          activity_date - ROW_NUMBER() OVER (ORDER BY activity_date DESC)::integer AS grp
        FROM dates
      )
      SELECT 
        COUNT(*) as streak_length,
        MIN(activity_date) as streak_start,
        MAX(activity_date) as streak_end
      FROM consecutive
      WHERE grp = (
        SELECT activity_date - ROW_NUMBER() OVER (ORDER BY activity_date DESC)::integer
        FROM consecutive
        WHERE activity_date = CURRENT_DATE OR activity_date = CURRENT_DATE - 1
        LIMIT 1
      )
    `, [userId]);

    // Longest streak
    const longestStreakQuery = await query(`
      WITH dates AS (
        SELECT activity_date
        FROM daily_activity
        WHERE user_id = $1 AND problems_solved > 0
        ORDER BY activity_date
      ),
      consecutive AS (
        SELECT 
          activity_date,
          activity_date - ROW_NUMBER() OVER (ORDER BY activity_date)::integer AS grp
        FROM dates
      ),
      groups AS (
        SELECT grp, COUNT(*) as streak_length
        FROM consecutive
        GROUP BY grp
      )
      SELECT COALESCE(MAX(streak_length), 0) as longest_streak FROM groups
    `, [userId]);

    // Today's progress
    const todayQuery = await query(`
      SELECT COALESCE(problems_solved, 0) as today_solved
      FROM daily_activity
      WHERE user_id = $1 AND activity_date = CURRENT_DATE
    `, [userId]);

    // Recent activity (last 7 days)
    const recentQuery = await query(`
      SELECT activity_date, problems_solved
      FROM daily_activity
      WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY activity_date
    `, [userId]);

    const overall = overallQuery.rows[0];
    const currentStreak = streakQuery.rows[0]?.streak_length || 0;

    res.json({
      overall: {
        total: parseInt(overall.total),
        solved: parseInt(overall.solved),
        revision: parseInt(overall.revision),
        pending: parseInt(overall.pending),
        percentage: overall.total > 0 ? Math.round((overall.solved / overall.total) * 100) : 0,
      },
      topics: topicQuery.rows.map(r => ({
        ...r,
        total: parseInt(r.total),
        solved: parseInt(r.solved),
        revision: parseInt(r.revision),
        percentage: parseFloat(r.percentage) || 0,
      })),
      difficulty: difficultyQuery.rows.map(r => ({
        ...r,
        total: parseInt(r.total),
        solved: parseInt(r.solved),
        percentage: parseFloat(r.percentage) || 0,
      })),
      streak: {
        current: parseInt(currentStreak),
        longest: parseInt(longestStreakQuery.rows[0]?.longest_streak || 0),
        today: parseInt(todayQuery.rows[0]?.today_solved || 0),
        dailyGoal: req.user.daily_goal,
      },
      recentActivity: recentQuery.rows,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHeatmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 12 } = req.query;

    const result = await query(`
      SELECT 
        activity_date::text as date,
        problems_solved as count
      FROM daily_activity
      WHERE user_id = $1 
        AND activity_date >= CURRENT_DATE - ($2 || ' months')::interval
        AND problems_solved > 0
      ORDER BY activity_date
    `, [userId, months]);

    res.json({ heatmap: result.rows });
  } catch (err) {
    console.error('Heatmap error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getWeakTopics = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        p.topic,
        COUNT(p.id) as total,
        COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) as solved,
        ROUND(COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) * 100.0 / COUNT(p.id), 1) as percentage
      FROM problems p
      LEFT JOIN user_problem_status ups ON p.id = ups.problem_id AND ups.user_id = $1
      GROUP BY p.topic
      HAVING COUNT(CASE WHEN ups.status = 'SOLVED' THEN 1 END) * 100.0 / COUNT(p.id) < 50
      ORDER BY percentage ASC
      LIMIT 5
    `, [userId]);

    res.json({
      weakTopics: result.rows.map(r => ({
        ...r,
        total: parseInt(r.total),
        solved: parseInt(r.solved),
        percentage: parseFloat(r.percentage) || 0,
      })),
    });
  } catch (err) {
    console.error('Weak topics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRevisionList = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        p.id, p.title, p.topic, p.difficulty, p.link, p.platform,
        ups.notes, ups.last_updated
      FROM problems p
      JOIN user_problem_status ups ON p.id = ups.problem_id
      WHERE ups.user_id = $1 AND ups.status = 'REVISION'
      ORDER BY ups.last_updated DESC
    `, [userId]);

    res.json({ problems: result.rows });
  } catch (err) {
    console.error('Revision list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDashboardStats, getHeatmap, getWeakTopics, getRevisionList };
