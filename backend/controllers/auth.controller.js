import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.config.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';

const generateTokens = (user) => {
  const payload = {
    id: user.id,
    role_id: user.role_id,
    email: user.email,
    full_name: user.full_name
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });

  const refreshToken = uuidv4();

  return { accessToken, refreshToken };
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await pool.execute(
      'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokens = generateTokens(user);

    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, tokens.refreshToken]
    );

    const { password: _, ...userData } = user;

    res.json({
      ...tokens,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { full_name, email, phone, password, role_id } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email and password are required' });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const userRoleId = role_id || 3; // default to Student

    const [result] = await pool.execute(
      'INSERT INTO users (role_id, full_name, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [userRoleId, full_name, email, phone || null, hashedPassword]
    );

    const [newUser] = await pool.execute(
      'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [result.insertId]
    );

    const user = newUser[0];
    const tokens = generateTokens(user);

    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, tokens.refreshToken]
    );

    const { password: _, ...userData } = user;

    res.status(201).json({
      ...tokens,
      user: userData
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const [tokens] = await pool.execute(
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [refresh_token]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const [users] = await pool.execute(
      'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [tokens[0].user_id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];

    await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refresh_token]);

    const newTokens = generateTokens(user);

    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, newTokens.refreshToken]
    );

    const { password: _, ...userData } = user;

    res.json({
      ...newTokens,
      user: userData
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refresh_token]);
    }

    await pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [req.user.id]);

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const me = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.role_id, u.full_name, u.email, u.phone, u.profile_image,
              u.status, u.email_verified_at, u.created_at, r.role_name
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
