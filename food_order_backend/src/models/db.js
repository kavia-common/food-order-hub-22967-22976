'use strict';

/**
 * Simple in-memory data store to simulate persistence.
 * This can be replaced with a real database layer later.
 *
 * Note on .env for future:
 * - DB_URL: connection string for a persistent database (e.g., Postgres/Mongo).
 * - JWT_SECRET: secret for signing authentication tokens.
 * - TOKEN_EXPIRES_IN: JWT TTL (e.g., "1h", "7d").
 */

const db = {
  users: [
    // password hashing is simulated; do NOT use in production
    // admin default user (password: admin123)
    {
      id: 'u_admin',
      name: 'Admin',
      email: 'admin@foodhub.local',
      passwordHash: 'admin123', // placeholder only
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  menu: [
    {
      id: 'm_001',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomatoes, mozzarella, basil.',
      price: 9.99,
      category: 'Pizza',
      available: true,
      imageUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'm_002',
      name: 'Veggie Burger',
      description: 'Plant-based patty with fresh veggies.',
      price: 8.49,
      category: 'Burgers',
      available: true,
      imageUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  orders: [],
};

module.exports = db;
