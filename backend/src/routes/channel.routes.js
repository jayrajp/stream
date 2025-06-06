const express = require('express');
const { body } = require('express-validator');
const {
  createChannel,
  getAllChannels,
  getUserChannels,
  getChannelById,
  updateChannel,
  deleteChannel
} = require('../controllers/channel.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Create a channel
router.post(
  '/',
  authenticate,
  [
    body('name')
      .isString()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Channel name must be between 3 and 50 characters'),
    body('description')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters')
  ],
  createChannel
);

// Get all channels
router.get('/', getAllChannels);

// Get user's channels
router.get('/my-channels', authenticate, getUserChannels);

// Get channel by ID
router.get('/:id', getChannelById);

// Update channel
router.put(
  '/:id',
  authenticate,
  [
    body('name')
      .isString()
      .trim()
      .isLength({ min:.3, max: 50 })
      .withMessage('Channel name must be between 3 and 50 characters'),
    body('description')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters')
  ],
  updateChannel
);

// Delete channel
router.delete('/:id', authenticate, deleteChannel);

module.exports = router;