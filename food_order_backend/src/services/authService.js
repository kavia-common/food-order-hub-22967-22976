'use strict';

const db = require('../models/db');
const { genId } = require('../utils/id');
const { hashPassword, verifyPassword, generateToken } = require('../utils/security');

/**
 * PUBLIC_INTERFACE
 * Register a new user.
 */
function register({ name, email, password }) {
  if (!name || !email || !password) {
    const err = new Error('Missing required fields: name, email, password');
    err.status = 400;
    throw err;
  }
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const now = new Date().toISOString();
  const user = {
    id: genId('u'),
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: 'user',
    createdAt: now,
    updatedAt: now,
  };
  db.users.push(user);
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * PUBLIC_INTERFACE
 * Authenticate a user and return token.
 */
function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('Missing required fields: email, password');
    err.status = 400;
    throw err;
  }
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const token = generateToken(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'dev-secret',
    process.env.TOKEN_EXPIRES_IN ? parseInt(process.env.TOKEN_EXPIRES_IN, 10) : 60 * 60
  );
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

module.exports = {
  register,
  login,
};
