import pool from '../config/db.config.js';

export const getBatches = async (req, res) => {
  try {
    const { course_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, c.course_name, u.full_name as instructor_name,
             (SELECT COUNT(*) FROM batch_students WHERE batch_id = b.id) as enrolled_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      JOIN users u ON b.instructor_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (course_id) {
      query += ' AND b.course_id = ?';
      params.push(course_id);
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM batches');

    res.json({
      batches: rows,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get batches error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const [batches] = await pool.execute(`
      SELECT b.*, c.course_name, u.full_name as instructor_name
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      JOIN users u ON b.instructor_id = u.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (batches.length === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const [students] = await pool.execute(`
      SELECT u.id, u.full_name, u.email, bs.joined_at
      FROM batch_students bs
      JOIN users u ON bs.student_id = u.id
      WHERE bs.batch_id = ?
    `, [req.params.id]);

    res.json({ batch: batches[0], students });
  } catch (err) {
    console.error('Get batch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBatch = async (req, res) => {
  try {
    const { course_id, instructor_id, batch_name, start_date, end_date, max_students } = req.body;

    if (!course_id || !instructor_id || !batch_name || !start_date) {
      return res.status(400).json({ error: 'Course, instructor, batch name and start date are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO batches (course_id, instructor_id, batch_name, start_date, end_date, max_students) VALUES (?, ?, ?, ?, ?, ?)',
      [course_id, instructor_id, batch_name, start_date, end_date || null, max_students || 0]
    );

    const [batch] = await pool.execute('SELECT * FROM batches WHERE id = ?', [result.insertId]);
    res.status(201).json({ batch: batch[0] });
  } catch (err) {
    console.error('Create batch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const { course_id, instructor_id, batch_name, start_date, end_date, max_students } = req.body;

    const fields = [];
    const params = [];

    if (course_id !== undefined) { fields.push('course_id = ?'); params.push(course_id); }
    if (instructor_id !== undefined) { fields.push('instructor_id = ?'); params.push(instructor_id); }
    if (batch_name !== undefined) { fields.push('batch_name = ?'); params.push(batch_name); }
    if (start_date !== undefined) { fields.push('start_date = ?'); params.push(start_date); }
    if (end_date !== undefined) { fields.push('end_date = ?'); params.push(end_date); }
    if (max_students !== undefined) { fields.push('max_students = ?'); params.push(max_students); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    const [result] = await pool.execute(
      `UPDATE batches SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const [batch] = await pool.execute('SELECT * FROM batches WHERE id = ?', [req.params.id]);
    res.json({ batch: batch[0] });
  } catch (err) {
    console.error('Update batch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM batches WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.json({ message: 'Batch deleted successfully' });
  } catch (err) {
    console.error('Delete batch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { student_id } = req.body;
    const batchId = req.params.id;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const [batch] = await pool.execute('SELECT * FROM batches WHERE id = ?', [batchId]);
    if (batch.length === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const [existing] = await pool.execute(
      'SELECT id FROM batch_students WHERE batch_id = ? AND student_id = ?',
      [batchId, student_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Student already enrolled in this batch' });
    }

    if (batch[0].max_students > 0) {
      const [count] = await pool.execute(
        'SELECT COUNT(*) as enrolled FROM batch_students WHERE batch_id = ?',
        [batchId]
      );
      if (count[0].enrolled >= batch[0].max_students) {
        return res.status(400).json({ error: 'Batch is full' });
      }
    }

    await pool.execute(
      'INSERT INTO batch_students (batch_id, student_id) VALUES (?, ?)',
      [batchId, student_id]
    );

    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (err) {
    console.error('Enroll student error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
