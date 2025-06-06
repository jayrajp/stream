const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/init');
const { validationResult } = require('express-validator');

/**
 * Create a new stream
 */
const createStream = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, channelId } = req.body;
    const userId = req.user.id;
    const streamId = uuidv4();

    const { rows } = await pool.query('SELECT * FROM channels WHERE id = $1 LIMIT 1', [channelId]);
    const channel = rows[0];

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    if (channel.owner_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to create stream for this channel' });
    }

    await pool.query(
      'INSERT INTO streams (id, title, description, channel_id, status, started_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [streamId, title, description, channelId, 'scheduled', null]
    );

    return res.status(201).json({
      success: true,
      message: 'Stream created successfully',
      data: {
        id: streamId,
        title,
        description,
        channel_id: channelId,
        status: 'scheduled'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/** Start a stream */
const startStream = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const startedAt = new Date().toISOString();

    const { rows } = await pool.query(
      `SELECT s.*, c.owner_id FROM streams s JOIN channels c ON s.channel_id = c.id WHERE s.id = $1 LIMIT 1`,
      [id]
    );
    const stream = rows[0];

    if (!stream) return res.status(404).json({ success: false, message: 'Stream not found' });
    if (stream.owner_id !== userId) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (stream.status === 'live') return res.status(400).json({ success: false, message: 'Stream is already live' });

    await pool.query('UPDATE streams SET status = $1, started_at = $2 WHERE id = $3', ['live', startedAt, id]);

    return res.status(200).json({ success: true, message: 'Stream started', data: { id, status: 'live', started_at: startedAt } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/** End a stream */
const endStream = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const endedAt = new Date().toISOString();
    const { recordingPath, transcriptPath } = req.body;

    const { rows } = await pool.query(
      `SELECT s.*, c.owner_id FROM streams s JOIN channels c ON s.channel_id = c.id WHERE s.id = $1 LIMIT 1`,
      [id]
    );
    const stream = rows[0];

    if (!stream) return res.status(404).json({ success: false, message: 'Stream not found' });
    if (stream.owner_id !== userId) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (stream.status !== 'live') return res.status(400).json({ success: false, message: 'Stream is not live' });

    await pool.query(
      'UPDATE streams SET status = $1, ended_at = $2, recording_path = $3, transcript_path = $4 WHERE id = $5',
      ['ended', endedAt, recordingPath, transcriptPath, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Stream ended',
      data: {
        id,
        status: 'ended',
        ended_at: endedAt,
        recording_path: recordingPath,
        transcript_path: transcriptPath
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/** Get all streams */
const getAllStreams = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? 'SELECT * FROM streams WHERE status = $1' : 'SELECT * FROM streams';
    const values = status ? [status] : [];

    const { rows } = await pool.query(query, values);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/** Get stream by ID */
const getStreamById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM streams WHERE id = $1 LIMIT 1', [id]);
    const stream = rows[0];

    if (!stream) return res.status(404).json({ success: false, message: 'Stream not found' });
    return res.status(200).json({ success: true, data: stream });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/** Get streams by channel ID */
const getStreamsByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { status } = req.query;

    let query = 'SELECT * FROM streams WHERE channel_id = $1';
    const values = [channelId];

    if (status) {
      query += ' AND status = $2';
      values.push(status);
    }

    const { rows } = await pool.query(query, values);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createStream,
  startStream,
  endStream,
  getAllStreams,
  getStreamById,
  getStreamsByChannel
};
