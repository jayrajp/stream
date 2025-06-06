const express = require('express');
const { body } = require('express-validator');
const {
  registerViewer,
  recordViewerDeparture,
  getViewersByStream,
  getCurrentViewersCount
} = require('../controllers/viewer.controller');

const router = express.Router();

// Register a viewer
router.post(
  '/',
  [
    body('firstName')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Last name is required'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('streamId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Stream ID is required')
  ],
  registerViewer
);

// Record viewer departure
router.put('/:id/leave', recordViewerDeparture);

// Get viewers by stream
router.get('/stream/:streamId', getViewersByStream);

// Get current viewers count
router.get('/stream/:streamId/count', getCurrentViewersCount);

module.exports = router;