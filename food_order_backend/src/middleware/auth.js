'use strict';

const { verifyToken } = require('../utils/security');
const db = require('../models/db');

/**
 * PUBLIC_INTERFACE
 * Authenticate requests using Authorization: Bearer <token>.
 */
function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Missing token' });
    }
    const payload = verifyToken(token, process.env.JWT_SECRET || 'dev-secret');
    if (!payload) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
    const user = db.users.find(u => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch (e) {
    next(e);
  }
}

/**
 * PUBLIC_INTERFACE
 * Authorize only admins.
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  }
  next();
}

module.exports = {
  authenticate,
  requireAdmin,
};
