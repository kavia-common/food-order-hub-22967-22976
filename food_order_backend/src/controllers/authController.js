'use strict';

const authService = require('../services/authService');

class AuthController {
  /**
   * PUBLIC_INTERFACE
   * Register a user.
   */
  async register(req, res, next) {
    try {
      const user = authService.register(req.body || {});
      return res.status(201).json({ status: 'success', data: user });
    } catch (e) {
      return next(e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Login user and return token.
   */
  async login(req, res, next) {
    try {
      const result = authService.login(req.body || {});
      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      return next(e);
    }
  }
}

module.exports = new AuthController();
