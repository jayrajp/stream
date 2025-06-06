const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/init');
const { validationResult } = require('express-validator');

/**
 * Register a viewer for a stream
 */
const registerViewer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, streamId } = req.body;
    const viewerId = uuidv4();

    const streamResult = await pool.query('SELECT * FROM streams WHERE id = $1 LIMIT 1', [streamId]);
    const stream = streamResult.rows[0];

    if (!stream) {
      return res.status(404).json({ success: false, message: 'Stream not found' });
    }

    if (stream.status !== 'live') {
      return res.status(400).json({ success: false, message: 'Stream is not live' });
    }

    await pool.query(
      'INSERT INTO viewers (id, first_name, last_name, email, stream_id) VALUES ($1, $2, $3, $4, $5)',
      [viewerId, firstName, lastName, email, streamId]
    );

    return res.status(201).json({
      success: true,
      message: 'Viewer registered successfully',
      data: {
        id: viewerId,
        first_name: firstName,
        last_name: lastName,
        email,
        stream_id: streamId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Record viewer departure
 */
const recordViewerDeparture = async (req, res) => {
  try {
    const { id } = req.params;
    const leftAt = new Date().toISOString();

    const result = await pool.query('UPDATE viewers SET left_at = $1 WHERE id = $2', [leftAt, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Viewer not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Viewer departure recorded successfully',
      data: {
        id,
        left_at: leftAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get viewers by stream ID
 */
const getViewersByStream = async (req, res) => {
  try {
    const { streamId } = req.params;
    const result = await pool.query('SELECT * FROM viewers WHERE stream_id = $1', [streamId]);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get current viewers count by stream ID
 */
const getCurrentViewersCount = async (req, res) => {
  try {
    const { streamId } = req.params;
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM viewers WHERE stream_id = $1 AND left_at IS NULL',
      [streamId]
    );

    return res.status(200).json({
      success: true,
      data: {
        stream_id: streamId,
        current_viewers: parseInt(result.rows[0].count, 10)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerViewer,
  recordViewerDeparture,
  getViewersByStream,
  getCurrentViewersCount
};
