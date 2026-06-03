import pool from '../config/db.config.js';

export const authorize = (...allowedRoleIds) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoleIds.includes(req.user.role_id)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const authorizePermission = (permissionName) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const [rows] = await pool.execute(`
        SELECT 1 FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = ? AND p.permission_name = ?
        LIMIT 1
      `, [req.user.role_id, permissionName]);

      if (rows.length === 0) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    } catch (err) {
      console.error('Permission check error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
