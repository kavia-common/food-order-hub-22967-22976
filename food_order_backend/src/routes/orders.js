'use strict';

const express = require('express');
const controller = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order placement and tracking
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List orders (self or all for admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [placed, preparing, ready, completed, cancelled] }
 *     responses:
 *       200:
 *         description: Orders list
 */
router.get('/', authenticate, controller.list.bind(controller));

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menuItemId, quantity]
 *                   properties:
 *                     menuItemId: { type: string }
 *                     quantity: { type: integer, minimum: 1 }
 *               notes: { type: string }
 *               deliveryMethod: { type: string, enum: [pickup, delivery], default: pickup }
 *     responses:
 *       201:
 *         description: Order placed
 */
router.post('/', authenticate, controller.place.bind(controller));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order
 */
router.get('/:id', authenticate, controller.get.bind(controller));

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [placed, preparing, ready, completed, cancelled] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authenticate, requireAdmin, controller.updateStatus.bind(controller));

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancel order (user)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled
 */
router.post('/:id/cancel', authenticate, controller.cancel.bind(controller));

module.exports = router;
