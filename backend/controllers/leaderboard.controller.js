import pool from '../config/db.config.js';

export const getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { limit = 20 } = req.query;

    const [leaderboard] = await pool.execute(`
      SELECT l.rank_position, l.score, u.id as student_id, u.full_name as student_name, u.profile_image
      FROM leaderboards l
      JOIN users u ON l.student_id = u.id
      WHERE l.quiz_id = ?
      ORDER BY l.rank_position ASC
      LIMIT ?
    `, [quizId, parseInt(limit)]);

    const [quiz] = await pool.execute(
      'SELECT id, title, total_marks FROM quizzes WHERE id = ?',
      [quizId]
    );

    res.json({
      quiz: quiz[0] || null,
      leaderboard,
      total_participants: leaderboard.length
    });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
