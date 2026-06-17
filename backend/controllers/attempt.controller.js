import pool from '../config/db.config.js';

export const startAttempt = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { quiz_id } = req.body;
    const student_id = req.user.id;

    if (!quiz_id) {
      return res.status(400).json({ error: 'Quiz ID is required' });
    }

    const [quizzes] = await connection.query(
      'SELECT * FROM quizzes WHERE id = ? AND status IN ("published", "active")',
      [quiz_id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or not available' });
    }

    const quiz = quizzes[0];

    if (quiz.start_time && new Date(quiz.start_time) > new Date()) {
      return res.status(400).json({ error: 'Quiz has not started yet' });
    }

    if (quiz.end_time && new Date(quiz.end_time) < new Date()) {
      return res.status(400).json({ error: 'Quiz has already ended' });
    }

    const [existing] = await connection.query(
      'SELECT id FROM quiz_attempts WHERE quiz_id = ? AND student_id = ? AND status = "in_progress"',
      [quiz_id, student_id]
    );

    if (existing.length > 0) {
      // Resume existing attempt
      const [attempt] = await connection.query(
        'SELECT * FROM quiz_attempts WHERE id = ?', [existing[0].id]
      );
      await connection.commit();
      return res.json({ attempt: attempt[0], resumed: true });
    }

    const [result] = await connection.query(
      'INSERT INTO quiz_attempts (quiz_id, student_id, started_at, status) VALUES (?, ?, NOW(), "in_progress")',
      [quiz_id, student_id]
    );

    const [attempt] = await connection.query(
      'SELECT * FROM quiz_attempts WHERE id = ?', [result.insertId]
    );

    await connection.commit();
    res.status(201).json({ attempt: attempt[0], resumed: false });
  } catch (err) {
    await connection.rollback();
    console.error('Start attempt error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

export const submitAttempt = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const attemptId = req.params.id;
    const { answers } = req.body;

    const [attempts] = await connection.query(
      'SELECT qa.*, q.negative_marking, q.passing_marks, q.total_marks FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.id = ? AND qa.student_id = ?',
      [attemptId, req.user.id]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    const attempt = attempts[0];

    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ error: 'Attempt already submitted' });
    }

    let totalScore = 0;

    if (answers && Array.isArray(answers)) {
      for (const answer of answers) {
        const { question_id, selected_option_id, answer_text } = answer;

        // Get the question and correct options
        const [questions] = await connection.query(
          'SELECT * FROM questions WHERE id = ?', [question_id]
        );

        if (questions.length === 0) continue;
        const question = questions[0];

        let marksAwarded = 0;

        if (question.question_type === 'mcq' || question.question_type === 'true_false') {
          const [options] = await connection.query(
            'SELECT is_correct FROM question_options WHERE id = ? AND question_id = ?',
            [selected_option_id, question_id]
          );
          if (options.length > 0 && options[0].is_correct) {
            marksAwarded = parseFloat(question.marks);
          } else if (attempt.negative_marking && selected_option_id) {
            marksAwarded = -parseFloat(question.marks) * 0.25; // 25% negative
          }
        } else if (question.question_type === 'multiple_correct') {
          const [correctOptions] = await connection.query(
            'SELECT id FROM question_options WHERE question_id = ? AND is_correct = TRUE',
            [question_id]
          );
          const correctIds = correctOptions.map(o => o.id);

          // Check selected options
          const selectedIds = Array.isArray(selected_option_id)
            ? selected_option_id
            : [selected_option_id];

          const allCorrect = selectedIds.every(id => correctIds.includes(id))
            && correctIds.every(id => selectedIds.includes(parseInt(id)));

          if (allCorrect) {
            marksAwarded = parseFloat(question.marks);
          }
        } else if (question.question_type === 'fill_blanks') {
          if (answer_text && answer_text.trim().toLowerCase() ===
            (await getCorrectAnswer(connection, question_id))?.toLowerCase()) {
            marksAwarded = parseFloat(question.marks);
          }
        }

        await connection.query(
          'INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, answer_text, marks_awarded) VALUES (?, ?, ?, ?, ?)',
          [attemptId, question_id, selected_option_id || null, answer_text || null, marksAwarded]
        );

        totalScore += marksAwarded;
      }
    }

    const percentage = attempt.total_marks > 0
      ? (totalScore / attempt.total_marks) * 100
      : 0;

    const resultStatus = percentage >= attempt.passing_marks ? 'pass' : 'fail';

    await connection.query(
      'UPDATE quiz_attempts SET submitted_at = NOW(), total_score = ?, percentage = ?, status = "completed" WHERE id = ?',
      [totalScore, percentage, attemptId]
    );

    // Insert result
    const [existingResult] = await connection.query(
      'SELECT id FROM results WHERE attempt_id = ?', [attemptId]
    );

    if (existingResult.length === 0) {
      await connection.query(
        'INSERT INTO results (attempt_id, student_id, quiz_id, final_score, percentage, result_status) VALUES (?, ?, ?, ?, ?, ?)',
        [attemptId, req.user.id, attempt.quiz_id, totalScore, percentage, resultStatus]
      );
    }

    // Update leaderboard
    const [allAttempts] = await connection.query(
      'SELECT id, student_id, total_score FROM quiz_attempts WHERE quiz_id = ? AND status = "completed" ORDER BY total_score DESC',
      [attempt.quiz_id]
    );

    for (let i = 0; i < allAttempts.length; i++) {
      await connection.query(
        'INSERT INTO leaderboards (quiz_id, student_id, score, rank_position) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score), rank_position = VALUES(rank_position)',
        [attempt.quiz_id, allAttempts[i].student_id, allAttempts[i].total_score, i + 1]
      );
    }

    await connection.query(
      'UPDATE quiz_attempts SET rank_position = ? WHERE id = ?',
      [allAttempts.findIndex(a => a.id === parseInt(attemptId)) + 1, attemptId]
    );

    await connection.commit();

    res.json({
      message: 'Attempt submitted successfully',
      score: totalScore,
      percentage,
      result: resultStatus
    });
  } catch (err) {
    await connection.rollback();
    console.error('Submit attempt error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

async function getCorrectAnswer(connection, questionId) {
  const [options] = await connection.query(
    'SELECT option_text FROM question_options WHERE question_id = ? AND is_correct = TRUE LIMIT 1',
    [questionId]
  );
  return options.length > 0 ? options[0].option_text : null;
}

export const getAttempt = async (req, res) => {
  try {
    const [attempts] = await pool.query(`
      SELECT qa.*, q.title as quiz_title, q.duration_minutes, q.total_marks, q.passing_marks, q.negative_marking
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.id = ? AND qa.student_id = ?
    `, [req.params.id, req.user.id]);

    if (attempts.length === 0) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    const [answers] = await pool.query(`
      SELECT aa.*, q.question_type, q.question_text, q.marks
      FROM attempt_answers aa
      JOIN questions q ON aa.question_id = q.id
      WHERE aa.attempt_id = ?
    `, [req.params.id]);

    res.json({ attempt: attempts[0], answers });
  } catch (err) {
    console.error('Get attempt error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentAttempts = async (req, res) => {
  try {
    const [attempts] = await pool.query(`
      SELECT qa.*, q.title as quiz_title, q.total_marks
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.student_id = ?
      ORDER BY qa.created_at DESC
    `, [req.user.id]);

    res.json({ attempts });
  } catch (err) {
    console.error('Get student attempts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
