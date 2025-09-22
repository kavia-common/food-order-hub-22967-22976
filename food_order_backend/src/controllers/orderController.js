'use strict';

const orderService = require('../services/orderService');

class OrderController {
  /**
   * PUBLIC_INTERFACE
   * Place an order for the authenticated user.
   */
  async place(req, res, next) {
    try {
      const order = orderService.placeOrder({
        userId: req.user.id,
        items: req.body.items || [],
        notes: req.body.notes || '',
        deliveryMethod: req.body.deliveryMethod || 'pickup',
      });
      res.status(201).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get one order.
   */
  async get(req, res, next) {
    try {
      const order = orderService.getById({ id: req.params.id, user: req.user });
      res.status(200).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * List orders (user sees own, admin sees all).
   */
  async list(req, res, next) {
    try {
      const orders = orderService.list({ user: req.user, status: req.query.status });
      res.status(200).json({ status: 'success', data: orders });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Update order status (admin).
   */
  async updateStatus(req, res, next) {
    try {
      const order = orderService.updateStatus({
        id: req.params.id,
        status: req.body.status,
        actor: req.user,
      });
      res.status(200).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Cancel order (user).
   */
  async cancel(req, res, next) {
    try {
      const order = orderService.cancel({ id: req.params.id, user: req.user });
      res.status(200).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrderController();
