import pool from '../config/db.config.js';

export const getUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id, u.role_id, u.full_name, u.email, u.phone, u.profile_image,
             u.status, u.email_verified_at, u.created_at, r.role_name
      FROM users u JOIN roles r ON u.role_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      query += ' AND u.role_id = ?';
      params.push(role);
    }
    if (status) {
      query += ' AND u.status = ?';
      params.push(status);
    }

    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM users' + (role ? ' WHERE role_id = ?' : ''),
      role ? [role] : []
    );

    res.json({
      users: rows,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.role_id, u.full_name, u.email, u.phone, u.profile_image,
              u.status, u.email_verified_at, u.created_at, r.role_name
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { full_name, phone, profile_image, status } = req.body;
    const userId = req.params.id;

    const fields = [];
    const params = [];

    if (full_name !== undefined) { fields.push('full_name = ?'); params.push(full_name); }
    if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
    if (profile_image !== undefined) { fields.push('profile_image = ?'); params.push(profile_image); }
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(userId);
    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    const [users] = await pool.query(
      'SELECT id, role_id, full_name, email, phone, profile_image, status FROM users WHERE id = ?',
      [userId]
    );

    res.json({ user: users[0] });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
