import pool from '../config/db.config.js';
import { generateCertificateNo } from '../utils/helpers.js';

export const getCertificates = async (req, res) => {
  try {
    const { student_id, quiz_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, u.full_name as student_name, q.title as quiz_title
      FROM certificates c
      JOIN users u ON c.student_id = u.id
      JOIN quizzes q ON c.quiz_id = q.id
      WHERE 1=1
    `;
    const params = [];

    if (student_id) { query += ' AND c.student_id = ?'; params.push(student_id); }
    if (quiz_id) { query += ' AND c.quiz_id = ?'; params.push(quiz_id); }

    query += ' ORDER BY c.issued_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM certificates');

    res.json({
      certificates: rows,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get certificates error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const [certificates] = await pool.execute(`
      SELECT c.*, u.full_name as student_name, u.email as student_email,
             q.title as quiz_title, q.total_marks, q.passing_marks,
             r.final_score, r.percentage, r.result_status
      FROM certificates c
      JOIN users u ON c.student_id = u.id
      JOIN quizzes q ON c.quiz_id = q.id
      JOIN results r ON r.student_id = c.student_id AND r.quiz_id = c.quiz_id
      WHERE c.id = ?
    `, [req.params.id]);

    if (certificates.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({ certificate: certificates[0] });
  } catch (err) {
    console.error('Get certificate error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const [certificates] = await pool.execute(`
      SELECT c.*, q.title as quiz_title, q.total_marks, r.final_score, r.percentage, r.result_status
      FROM certificates c
      JOIN quizzes q ON c.quiz_id = q.id
      JOIN results r ON r.student_id = c.student_id AND r.quiz_id = c.quiz_id
      WHERE c.student_id = ?
      ORDER BY c.issued_at DESC
    `, [req.user.id]);

    res.json({ certificates });
  } catch (err) {
    console.error('Get my certificates error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Called when result is pass and certificate should be issued
export const issueCertificate = async (studentId, quizId) => {
  try {
    const [existing] = await pool.execute(
      'SELECT id FROM certificates WHERE student_id = ? AND quiz_id = ?',
      [studentId, quizId]
    );

    if (existing.length > 0) {
      return existing[0];
    }

    const certificateNo = generateCertificateNo();
    const url = `/certificates/${certificateNo}.pdf`;

    const [result] = await pool.execute(
      'INSERT INTO certificates (student_id, quiz_id, certificate_no, certificate_url) VALUES (?, ?, ?, ?)',
      [studentId, quizId, certificateNo, url]
    );

    return { id: result.insertId, certificate_no: certificateNo, certificate_url: url };
  } catch (err) {
    console.error('Issue certificate error:', err);
    throw err;
  }
};
