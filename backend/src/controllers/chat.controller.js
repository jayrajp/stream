const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { validationResult } = require('express-validator');

const db = getDatabase();

/**
 * Create a chat message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createChatMessage = (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { streamId, viewerId, message, sentiment } = req.body;
    const messageId = uuidv4();

    // Check if stream exists and is live
    db.get('SELECT * FROM streams WHERE id = ?', [streamId], (err, stream) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!stream) {
        return res.status(404).json({
          success: false,
          message: 'Stream not found'
        });
      }

      if (stream.status !== 'live') {
        return res.status(400).json({
          success: false,
          message: 'Stream is not live'
        });
      }

      // If viewerId is provided, check if viewer exists
      if (viewerId) {
        db.get('SELECT * FROM viewers WHERE id = ?', [viewerId], (err, viewer) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error',
              error: err.message
            });
          }

          if (!viewer) {
            return res.status(404).json({
              success: false,
              message: 'Viewer not found'
            });
          }

          insertChatMessage();
        });
      } else {
        insertChatMessage();
      }
    });

    function insertChatMessage() {
      db.run(
        'INSERT INTO chat_messages (id, stream_id, viewer_id, message, sentiment) VALUES (?, ?, ?, ?, ?)',
        [messageId, streamId, viewerId || null, message, sentiment || null],
        function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to create chat message',
              error: err.message
            });
          }

          return res.status(201).json({
            success: true,
            message: 'Chat message created successfully',
            data: {
              id: messageId,
              stream_id: streamId,
              viewer_id: viewerId,
              message,
              sentiment,
              created_at: new Date().toISOString()
            }
          });
        }
      );
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get chat messages by stream ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatMessagesByStream = (req, res) => {
  try {
    const { streamId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    db.all(
      'SELECT * FROM chat_messages WHERE stream_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [streamId, parseInt(limit), parseInt(offset)],
      (err, messages) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        return res.status(200).json({
          success: true,
          count: messages.length,
          data: messages
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createChatMessage,
  getChatMessagesByStream
};