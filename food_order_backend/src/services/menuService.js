'use strict';

const db = require('../models/db');
const { genId } = require('../utils/id');

/**
 * PUBLIC_INTERFACE
 * List menu items with simple query filters.
 */
function list({ category, available } = {}) {
  let items = [...db.menu];
  if (category) {
    items = items.filter(i => i.category?.toLowerCase() === category.toLowerCase());
  }
  if (typeof available !== 'undefined') {
    const flag = String(available).toLowerCase() === 'true';
    items = items.filter(i => i.available === flag);
  }
  return items;
}

/**
 * PUBLIC_INTERFACE
 * Get one item by ID.
 */
function getById(id) {
  const item = db.menu.find(i => i.id === id);
  if (!item) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  return item;
}

/**
 * PUBLIC_INTERFACE
 * Create a menu item (admin).
 */
function create({ name, description = '', price, category = 'General', available = true, imageUrl = '' }) {
  if (!name || typeof price !== 'number') {
    const err = new Error('Missing required fields: name (string), price (number)');
    err.status = 400;
    throw err;
  }
  const now = new Date().toISOString();
  const item = {
    id: genId('m'),
    name,
    description,
    price,
    category,
    available: Boolean(available),
    imageUrl,
    createdAt: now,
    updatedAt: now,
  };
  db.menu.push(item);
  return item;
}

/**
 * PUBLIC_INTERFACE
 * Update a menu item (admin).
 */
function update(id, payload) {
  const idx = db.menu.findIndex(i => i.id === id);
  if (idx === -1) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  const item = db.menu[idx];
  const updated = { ...item, ...payload, updatedAt: new Date().toISOString() };
  // keep id and createdAt intact
  updated.id = item.id;
  updated.createdAt = item.createdAt;
  db.menu[idx] = updated;
  return updated;
}

/**
 * PUBLIC_INTERFACE
 * Delete a menu item (admin).
 */
function remove(id) {
  const idx = db.menu.findIndex(i => i.id === id);
  if (idx === -1) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  const [deleted] = db.menu.splice(idx, 1);
  return deleted;
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
