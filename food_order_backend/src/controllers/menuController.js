'use strict';

const menuService = require('../services/menuService');

class MenuController {
  /**
   * PUBLIC_INTERFACE
   * List menu items with optional filters.
   */
  async list(req, res, next) {
    try {
      const { category, available } = req.query;
      const items = menuService.list({ category, available });
      res.status(200).json({ status: 'success', data: items });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get a single menu item by ID.
   */
  async get(req, res, next) {
    try {
      const item = menuService.getById(req.params.id);
      res.status(200).json({ status: 'success', data: item });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new menu item (admin).
   */
  async create(req, res, next) {
    try {
      const item = menuService.create(req.body || {});
      res.status(201).json({ status: 'success', data: item });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Update a menu item (admin).
   */
  async update(req, res, next) {
    try {
      const item = menuService.update(req.params.id, req.body || {});
      res.status(200).json({ status: 'success', data: item });
    } catch (e) {
      next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a menu item (admin).
   */
  async remove(req, res, next) {
    try {
      const item = menuService.remove(req.params.id);
      res.status(200).json({ status: 'success', data: item });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new MenuController();
