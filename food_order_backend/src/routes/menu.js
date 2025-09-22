'use strict';

const express = require('express');
const controller = require('../controllers/menuController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Menu browsing and management
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: List menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of items
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Menu item
 */
router.get('/:id', controller.get.bind(controller));

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Create a menu item (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               available: { type: boolean }
 *               imageUrl: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticate, requireAdmin, controller.create.bind(controller));

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update a menu item (admin)
 *     tags: [Menu]
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
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', authenticate, requireAdmin, controller.update.bind(controller));

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu item (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', authenticate, requireAdmin, controller.remove.bind(controller));

module.exports = router;
