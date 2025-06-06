const express = require('express');
const { body } = require('express-validator');
const {
  createStream,
  startStream,
  endStream,
  getAllStreams,
  getStreamById,
  getStreamsByChannel
} = require('../controllers/stream.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Create a stream
router.post(
  '/',
  authenticate,
  [
    body('title')
      .isString()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Stream title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('channelId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Channel ID is required')
  ],
  createStream
);

// Start a stream
router.put('/:id/start', authenticate, startStream);

// End a stream
router.put('/:id/end', authenticate, endStream);

// Get all streams
router.get('/', getAllStreams);

// Get stream by ID
router.get('/:id', getStreamById);

// Get streams by channel
router.get('/channel/:channelId', getStreamsByChannel);

module.exports = router;