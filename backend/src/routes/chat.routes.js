const express = require('express');
const { body } = require('express-validator');
const {
  createChatMessage,
  getChatMessagesByStream
} = require('../controllers/chat.controller');

const router = express.Router();

// Create a chat message
router.post(
  '/',
  [
    body('streamId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Stream ID is required'),
    body('viewerId')
      .optional()
      .isString()
      .trim(),
    body('message')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Message is required'),
    body('sentiment')
      .optional()
      .isString()
      .trim()
      .isIn(['positive', 'negative', 'neutral'])
      .withMessage('Sentiment must be positive, negative, or neutral')
  ],
  createChatMessage
);

// Get chat messages by stream
router.get('/stream/:streamId', getChatMessagesByStream);

module.exports = router;