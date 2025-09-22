'use strict';

const db = require('../models/db');
const { genId } = require('../utils/id');
const menuService = require('./menuService');

const ORDER_STATUSES = ['placed', 'preparing', 'ready', 'completed', 'cancelled'];

/**
 * PUBLIC_INTERFACE
 * Place a new order for a user.
 */
function placeOrder({ userId, items, notes = '', deliveryMethod = 'pickup' }) {
  if (!userId || !Array.isArray(items) || items.length === 0) {
    const err = new Error('Missing required fields: userId, items[]');
    err.status = 400;
    throw err;
  }
  // build line items with price snapshot
  const lineItems = items.map(({ menuItemId, quantity = 1 }) => {
    const menuItem = menuService.getById(menuItemId);
    if (!menuItem.available) {
      const e = new Error(`Menu item not available: ${menuItem.name}`);
      e.status = 400;
      throw e;
    }
    const qty = Math.max(1, parseInt(quantity, 10));
    return {
      menuItemId,
      name: menuItem.name,
      price: menuItem.price,
      quantity: qty,
      total: Number((menuItem.price * qty).toFixed(2)),
    };
  });

  const subtotal = Number(lineItems.reduce((acc, li) => acc + li.total, 0).toFixed(2));
  const taxRate = 0.08;
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const now = new Date().toISOString();
  const order = {
    id: genId('o'),
    userId,
    status: 'placed',
    deliveryMethod,
    notes,
    items: lineItems,
    charges: { subtotal, tax, total, currency: 'USD' },
    timeline: [{ at: now, status: 'placed' }],
    createdAt: now,
    updatedAt: now,
  };

  db.orders.push(order);
  return order;
}

/**
 * PUBLIC_INTERFACE
 * Get order by id (respect role).
 */
function getById({ id, user }) {
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (user.role !== 'admin' && order.userId !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return order;
}

/**
 * PUBLIC_INTERFACE
 * List orders for current user or all for admin.
 */
function list({ user, status }) {
  let orders = db.orders;
  if (user.role !== 'admin') {
    orders = orders.filter(o => o.userId === user.id);
  }
  if (status) {
    orders = orders.filter(o => o.status === status);
  }
  return orders;
}

/**
 * PUBLIC_INTERFACE
 * Update order status (admin).
 */
function updateStatus({ id, status, actor }) {
  if (!ORDER_STATUSES.includes(status)) {
    const err = new Error(`Invalid status. Allowed: ${ORDER_STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }
  const idx = db.orders.findIndex(o => o.id === id);
  if (idx === -1) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  const current = db.orders[idx];
  const now = new Date().toISOString();
  const updated = {
    ...current,
    status,
    timeline: [...current.timeline, { at: now, status, by: actor?.id || 'system' }],
    updatedAt: now,
  };
  db.orders[idx] = updated;
  return updated;
}

/**
 * PUBLIC_INTERFACE
 * Cancel order by user if allowed.
 */
function cancel({ id, user }) {
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (order.userId !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  if (['ready', 'completed', 'cancelled'].includes(order.status)) {
    const err = new Error('Order cannot be cancelled at this stage');
    err.status = 400;
    throw err;
  }
  return updateStatus({ id, status: 'cancelled', actor: user });
}

module.exports = {
  ORDER_STATUSES,
  placeOrder,
  getById,
  list,
  updateStatus,
  cancel,
};
