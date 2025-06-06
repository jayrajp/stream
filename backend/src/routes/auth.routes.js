const express = require('express');
const { body } = require('express-validator');
const { register, login, getCurrentUser } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('firstName')
      .isString()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('firstName must be between 3 and 30 characters'),
    body('lastName')
      .isString()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('lastName must be between 3 and 30 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isString()
      .notEmpty()
      .withMessage('Password is required')
  ],
  login
);

// Get current user
router.get('/me', authenticate, getCurrentUser);

module.exports = router;