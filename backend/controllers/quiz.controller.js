import pool from '../config/db.config.js';

export const getQuizzes = async (req, res) => {
  try {
    const { course_id, batch_id, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT q.*, u.full_name as created_by_name, c.course_name,
             (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count
      FROM quizzes q
      JOIN users u ON q.created_by = u.id
      LEFT JOIN courses c ON q.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (course_id) { query += ' AND q.course_id = ?'; params.push(course_id); }
    if (batch_id) { query += ' AND q.batch_id = ?'; params.push(batch_id); }
    if (status) {
      const statuses = status.split(',').map(s => s.trim()).filter(Boolean);
      if (statuses.length === 1) {
        query += ' AND q.status = ?';
        params.push(statuses[0]);
      } else if (statuses.length > 1) {
        query += ` AND q.status IN (${statuses.map(() => '?').join(',')})`;
        params.push(...statuses);
      }
    }

    query += ' ORDER BY q.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM quizzes');

    res.json({
      quizzes: rows,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get quizzes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const [quizzes] = await pool.query(`
      SELECT q.*, u.full_name as created_by_name, c.course_name, b.batch_name
      FROM quizzes q
      JOIN users u ON q.created_by = u.id
      LEFT JOIN courses c ON q.course_id = c.id
      LEFT JOIN batches b ON q.batch_id = b.id
      WHERE q.id = ?
    `, [req.params.id]);

    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const [questions] = await pool.query(`
      SELECT q.*, 
             (SELECT COUNT(*) FROM question_options WHERE question_id = q.id) as option_count
      FROM questions q
      WHERE q.quiz_id = ?
      ORDER BY q.id
    `, [req.params.id]);

    res.json({ quiz: quizzes[0], questions });
  } catch (err) {
    console.error('Get quiz error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const {
      title, description, course_id, batch_id,
      duration_minutes, total_marks, passing_marks,
      negative_marking, status, start_time, end_time
    } = req.body;

    if (!title || !duration_minutes || !total_marks) {
      return res.status(400).json({ error: 'Title, duration and total marks are required' });
    }

    const [result] = await pool.query(`
      INSERT INTO quizzes (title, description, course_id, batch_id, created_by,
        duration_minutes, total_marks, passing_marks, negative_marking, status, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, description || null, course_id || null, batch_id || null,
      req.user.id, duration_minutes, total_marks, passing_marks || 0,
      negative_marking || false, status || 'draft', start_time || null, end_time || null
    ]);

    const [quiz] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [result.insertId]);
    res.status(201).json({ quiz: quiz[0] });
  } catch (err) {
    console.error('Create quiz error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const fields = [];
    const params = [];

    const allowedFields = [
      'title', 'description', 'course_id', 'batch_id',
      'duration_minutes', 'total_marks', 'passing_marks',
      'negative_marking', 'status', 'start_time', 'end_time'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    const [result] = await pool.query(
      `UPDATE quizzes SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const [quiz] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [req.params.id]);
    res.json({ quiz: quiz[0] });
  } catch (err) {
    console.error('Update quiz error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM quizzes WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error('Delete quiz error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
