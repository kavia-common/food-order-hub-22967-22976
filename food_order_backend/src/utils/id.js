'use strict';

const crypto = require('crypto');

/**
 * Generate a short unique ID with a prefix.
 * Not collision-proof for high scale; replace with DB-generated IDs in production.
 * @param {string} prefix
 * @returns {string}
 */
function genId(prefix) {
  const rand = crypto.randomBytes(4).toString('hex');
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}${rand}`;
}

module.exports = { genId };
