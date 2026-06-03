import pool from '../config/db.config.js';

export const getCourses = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM courses');

    res.json({
      courses: rows,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const [courses] = await pool.execute(
      'SELECT c.*, GROUP_CONCAT(s.id) as subject_ids, GROUP_CONCAT(s.subject_name) as subject_names FROM courses c LEFT JOIN subjects s ON c.id = s.course_id WHERE c.id = ? GROUP BY c.id',
      [req.params.id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course: courses[0] });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { course_name, description, duration_days } = req.body;

    if (!course_name) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO courses (course_name, description, duration_days) VALUES (?, ?, ?)',
      [course_name, description || null, duration_days || 0]
    );

    const [course] = await pool.execute('SELECT * FROM courses WHERE id = ?', [result.insertId]);
    res.status(201).json({ course: course[0] });
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { course_name, description, duration_days, status } = req.body;

    const fields = [];
    const params = [];

    if (course_name !== undefined) { fields.push('course_name = ?'); params.push(course_name); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (duration_days !== undefined) { fields.push('duration_days = ?'); params.push(duration_days); }
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    const [result] = await pool.execute(
      `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const [course] = await pool.execute('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    res.json({ course: course[0] });
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM courses WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
