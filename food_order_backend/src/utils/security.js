'use strict';

/**
 * SECURITY NOTE:
 * This file uses placeholder implementations for hashing and tokens to avoid
 * external dependencies. Replace with bcrypt/argon2 for password hashing and
 * jsonwebtoken for JWT in production.
 *
 * Future .env:
 * - JWT_SECRET: Secret used to sign JWTs.
 * - TOKEN_EXPIRES_IN: e.g., "1h", "7d".
 */

const crypto = require('crypto');

function simpleHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * PUBLIC_INTERFACE
 * Validate a plain password against a stored hash.
 * This is a simplistic check; replace with bcrypt.compare in production.
 */
function verifyPassword(plain, hash) {
  return simpleHash(plain) === hash || plain === hash; // support legacy plain placeholder
}

/**
 * PUBLIC_INTERFACE
 * Hash a plain password.
 */
function hashPassword(plain) {
  return simpleHash(plain);
}

/**
 * PUBLIC_INTERFACE
 * Generate a pseudo token string. Replace with JWT in production.
 */
function generateToken(payload, secret = 'dev-secret', expiresInSeconds = 3600) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };
  const payloadStr = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${payloadStr}`).digest('base64url');
  return `${header}.${payloadStr}.${signature}`;
}

/**
 * PUBLIC_INTERFACE
 * Decode and verify pseudo token. Replace with JWT verify in production.
 */
function verifyToken(token, secret = 'dev-secret') {
  try {
    const [h, p, s] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
    if (expected !== s) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

module.exports = {
  verifyPassword,
  hashPassword,
  generateToken,
  verifyToken,
};
