import pool from '../config/db.config.js';

export const getAllQuestions = async (req, res) => {
  try {
    const { difficulty, question_type, search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT q.*, qz.title as quiz_title FROM questions q LEFT JOIN quizzes qz ON q.quiz_id = qz.id WHERE 1=1';
    const params = [];
    const countParams = [];

    if (difficulty) { query += ' AND q.difficulty = ?'; params.push(difficulty); countParams.push(difficulty); }
    if (question_type) { query += ' AND q.question_type = ?'; params.push(question_type); countParams.push(question_type); }
    if (search) { query += ' AND q.question_text LIKE ?'; params.push(`%${search}%`); countParams.push(`%${search}%`); }

    let countQuery = 'SELECT COUNT(*) as total FROM questions q WHERE 1=1';
    if (difficulty) countQuery += ' AND q.difficulty = ?';
    if (question_type) countQuery += ' AND q.question_type = ?';
    if (search) countQuery += ' AND q.question_text LIKE ?';

    const [countResult] = await pool.query(countQuery, countParams);

    query += ' ORDER BY q.id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [questions] = await pool.query(query, params);

    const questionIds = questions.map(q => q.id);
    let options = [];
    if (questionIds.length > 0) {
      const placeholders = questionIds.map(() => '?').join(',');
      [options] = await pool.query(
        `SELECT * FROM question_options WHERE question_id IN (${placeholders})`,
        questionIds
      );
    }

    const optionsByQuestion = {};
    options.forEach(opt => {
      if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = [];
      optionsByQuestion[opt.question_id].push(opt);
    });

    const questionsWithOptions = questions.map(q => ({
      ...q,
      options: optionsByQuestion[q.id] || []
    }));

    res.json({
      questions: questionsWithOptions,
      pagination: {
        total: countResult[0]?.total || 0,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get all questions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { difficulty, question_type, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM questions WHERE quiz_id = ?';
    const params = [quizId];

    if (difficulty) { query += ' AND difficulty = ?'; params.push(difficulty); }
    if (question_type) { query += ' AND question_type = ?'; params.push(question_type); }

    query += ' ORDER BY id LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [questions] = await pool.query(query, params);

    const questionIds = questions.map(q => q.id);
    let options = [];
    if (questionIds.length > 0) {
      const placeholders = questionIds.map(() => '?').join(',');
      [options] = await pool.query(
        `SELECT * FROM question_options WHERE question_id IN (${placeholders})`,
        questionIds
      );
    }

    const optionsByQuestion = {};
    options.forEach(opt => {
      if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = [];
      optionsByQuestion[opt.question_id].push(opt);
    });

    const questionsWithOptions = questions.map(q => ({
      ...q,
      options: optionsByQuestion[q.id] || []
    }));

    res.json({ questions: questionsWithOptions });
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const [questions] = await pool.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);

    if (questions.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const [options] = await pool.query(
      'SELECT * FROM question_options WHERE question_id = ?',
      [req.params.id]
    );

    const [tags] = await pool.query(`
      SELECT t.* FROM question_tags t
      JOIN question_tag_map tm ON t.id = tm.tag_id
      WHERE tm.question_id = ?
    `, [req.params.id]);

    res.json({
      question: { ...questions[0], options, tags }
    });
  } catch (err) {
    console.error('Get question error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createQuestion = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { quiz_id, question_type, question_text, marks, difficulty, explanation, options } = req.body;

    if (!question_text) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    if (!quiz_id) {
      return res.status(400).json({ error: 'Quiz ID is required' });
    }

    const [result] = await connection.query(
      'INSERT INTO questions (quiz_id, question_type, question_text, marks, difficulty, explanation) VALUES (?, ?, ?, ?, ?, ?)',
      [quiz_id, question_type || 'mcq', question_text, marks || 1, difficulty || 'medium', explanation || null]
    );

    const questionId = result.insertId;

    if (options && Array.isArray(options)) {
      for (const opt of options) {
        await connection.query(
          'INSERT INTO question_options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
          [questionId, opt.option_text, opt.is_correct || false]
        );
      }
    }

    await connection.commit();

    const [question] = await pool.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    const [questionOptions] = await pool.query(
      'SELECT * FROM question_options WHERE question_id = ?', [questionId]
    );

    res.status(201).json({ question: { ...question[0], options: questionOptions } });
  } catch (err) {
    await connection.rollback();
    console.error('Create question error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

export const updateQuestion = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { question_type, question_text, marks, difficulty, explanation, options } = req.body;

    const fields = [];
    const params = [];

    if (question_type !== undefined) { fields.push('question_type = ?'); params.push(question_type); }
    if (question_text !== undefined) { fields.push('question_text = ?'); params.push(question_text); }
    if (marks !== undefined) { fields.push('marks = ?'); params.push(marks); }
    if (difficulty !== undefined) { fields.push('difficulty = ?'); params.push(difficulty); }
    if (explanation !== undefined) { fields.push('explanation = ?'); params.push(explanation); }

    if (fields.length > 0) {
      params.push(req.params.id);
      await connection.query(
        `UPDATE questions SET ${fields.join(', ')} WHERE id = ?`,
        params
      );
    }

    if (options && Array.isArray(options)) {
      await connection.query('DELETE FROM question_options WHERE question_id = ?', [req.params.id]);
      for (const opt of options) {
        await connection.query(
          'INSERT INTO question_options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
          [req.params.id, opt.option_text, opt.is_correct || false]
        );
      }
    }

    await connection.commit();

    const [question] = await pool.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);
    const [questionOptions] = await pool.query(
      'SELECT * FROM question_options WHERE question_id = ?', [req.params.id]
    );

    res.json({ question: { ...question[0], options: questionOptions } });
  } catch (err) {
    await connection.rollback();
    console.error('Update question error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM questions WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Delete question error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const bulkImport = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { quiz_id, questions } = req.body;

    if (!quiz_id || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Quiz ID and questions array are required' });
    }

    const imported = [];

    for (const q of questions) {
      const [result] = await connection.query(
        'INSERT INTO questions (quiz_id, question_type, question_text, marks, difficulty, explanation) VALUES (?, ?, ?, ?, ?, ?)',
        [quiz_id, q.question_type || 'mcq', q.question_text, q.marks || 1, q.difficulty || 'medium', q.explanation || null]
      );

      if (q.options && Array.isArray(q.options)) {
        for (const opt of q.options) {
          await connection.query(
            'INSERT INTO question_options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
            [result.insertId, opt.option_text, opt.is_correct || false]
          );
        }
      }

      imported.push({ id: result.insertId, ...q });
    }

    await connection.commit();
    res.status(201).json({ message: `${imported.length} questions imported`, imported });
  } catch (err) {
    await connection.rollback();
    console.error('Bulk import error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};
