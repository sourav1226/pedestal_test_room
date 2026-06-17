import pool from '../config/db.config.js';

export const getResults = async (req, res) => {
  try {
    const { student_id, quiz_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.full_name as student_name, q.title as quiz_title
      FROM results r
      JOIN users u ON r.student_id = u.id
      JOIN quizzes q ON r.quiz_id = q.id
      WHERE 1=1
    `;
    const params = [];

    if (student_id) { query += ' AND r.student_id = ?'; params.push(student_id); }
    if (quiz_id) { query += ' AND r.quiz_id = ?'; params.push(quiz_id); }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM results');

    res.json({
      results: rows,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getResultById = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT r.*, u.full_name as student_name, u.email as student_email,
             q.title as quiz_title, q.total_marks, q.passing_marks,
             qa.started_at, qa.submitted_at, qa.rank_position
      FROM results r
      JOIN users u ON r.student_id = u.id
      JOIN quizzes q ON r.quiz_id = q.id
      JOIN quiz_attempts qa ON r.attempt_id = qa.id
      WHERE r.id = ?
    `, [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    const [answers] = await pool.query(`
      SELECT aa.*, q.question_text, q.question_type, q.marks, q.explanation,
             qo.option_text as selected_text,
             (SELECT option_text FROM question_options WHERE question_id = aa.question_id AND is_correct = TRUE LIMIT 1) as correct_text
      FROM attempt_answers aa
      JOIN questions q ON aa.question_id = q.id
      LEFT JOIN question_options qo ON aa.selected_option_id = qo.id
      WHERE aa.attempt_id = ?
    `, [results[0].attempt_id]);

    res.json({ result: results[0], answers });
  } catch (err) {
    console.error('Get result error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuizResults = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT r.*, u.full_name as student_name, u.email as student_email,
             qa.rank_position
      FROM results r
      JOIN users u ON r.student_id = u.id
      JOIN quiz_attempts qa ON r.attempt_id = qa.id
      WHERE r.quiz_id = ?
      ORDER BY qa.rank_position ASC
    `, [req.params.quizId]);

    res.json({ results });
  } catch (err) {
    console.error('Get quiz results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
